import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BoostRepository } from "@/lib/db/boost-repository";
import { ScoreRepository } from "@/lib/db/score-repository";
import { CVRepository } from "@/lib/db/cv-repository";
import { JobRepository } from "@/lib/db/job-repository";
import { ensureBoostsTable } from "@/lib/db/table-setup";
import { boostCreateSchema } from "@/lib/validation/boost-validation";
import { generateCVImprovements } from "@/lib/ai/cv-booster";
import { Boost } from "@/types/boost";
import { randomUUID } from "crypto";

// GET /api/v1/boosts - List user's boosts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureBoostsTable();

    const boosts = await BoostRepository.getByUserId(user.id);

    return NextResponse.json({ boosts }, { status: 200 });
  } catch (error) {
    console.error("List boosts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/boosts - Create boost from score
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureBoostsTable();

    const body = await request.json();

    const validation = boostCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { score_id } = validation.data;

    const score = await ScoreRepository.getById(score_id);
    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (score.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingBoost = await BoostRepository.getByScoreId(score_id);
    if (existingBoost) {
      return NextResponse.json(
        { error: "Boost already exists for this score", boost: existingBoost },
        { status: 409 }
      );
    }

    const cv = await CVRepository.getById(score.cv_id);
    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    let jobDescription: string;
    if (score.job_id) {
      const job = await JobRepository.getById(score.job_id);
      if (!job) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
      jobDescription = job.job_description;
    } else {
      return NextResponse.json(
        { error: "Score does not have associated job description" },
        { status: 400 }
      );
    }

    const boostResult = await generateCVImprovements(
      cv.parsed_data,
      jobDescription,
      score
    );

    const boostId = randomUUID();
    const boost: Boost = {
      boost_id: boostId,
      user_id: user.id,
      score_id: score.score_id,
      cv_id: cv.cv_id,
      cv_name: cv.cv_name,
      job_title: score.job_title,
      original_score: score.overall_score,
      original_cv_version: cv.version,
      boosted_cv_version: null,
      changes: boostResult.changes,
      status: "pending",
      changes_accepted: 0,
      changes_rejected: 0,
      estimated_new_score: boostResult.estimated_new_score,
      created_at: new Date().toISOString(),
      applied_at: null,
    };

    await BoostRepository.create(boost);

    return NextResponse.json(
      {
        message: "Boost created successfully",
        boost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create boost error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create boost",
      },
      { status: 500 }
    );
  }
}
