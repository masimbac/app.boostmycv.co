import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ScoreRepository } from "@/lib/db/score-repository";
import { JobRepository } from "@/lib/db/job-repository";
import { CVRepository } from "@/lib/db/cv-repository";
import { ensureScoresTable, ensureJobsTable } from "@/lib/db/table-setup";
import { scoreCreateSchema } from "@/lib/validation/job-validation";
import { scoreCV } from "@/lib/ai/cv-scorer";
import { parseJobDetails } from "@/lib/ai/job-parser";
import { Score } from "@/types/score";
import { Job } from "@/types/job";
import { randomUUID } from "crypto";

// GET /api/v1/scores - List scores with optional filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureScoresTable();

    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get("cv_id");
    const jobId = searchParams.get("job_id");

    let scores;
    if (cvId) {
      scores = await ScoreRepository.getByCvId(cvId);
    } else if (jobId) {
      scores = await ScoreRepository.getByJobId(jobId);
    } else {
      scores = await ScoreRepository.getByUserId(user.id);
    }

    return NextResponse.json({ scores }, { status: 200 });
  } catch (error) {
    console.error("List scores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/scores - Create score
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription limits
    const profileResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/${user.id}`,
      {
        headers: { Cookie: request.headers.get("cookie") || "" },
      }
    );
    const { user: userProfile } = await profileResponse.json();
    const isPro = userProfile.subscription_tier === "pro";

    await ensureScoresTable();

    // Check score limit for free users (5 per month)
    if (!isPro) {
      const scoreCount = await ScoreRepository.countUserScoresThisMonth(user.id);
      if (scoreCount >= 5) {
        return NextResponse.json(
          {
            error:
              "Free users can only create 5 scores per month. Upgrade to Pro for unlimited scoring.",
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    // Validate request body
    const validation = scoreCreateSchema.safeParse(body);
    if (!validation.success) {
      console.error("Score validation failed:", JSON.stringify(validation.error.issues, null, 2));
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { cv_id, job_id, job_description, save_job, job_details } =
      validation.data;

    // Get CV data
    const cv = await CVRepository.getById(cv_id);
    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Ensure user owns this CV
    if (cv.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or prepare job details
    let finalJobId: string | undefined;
    let finalJobTitle: string;
    let finalJobDescription: string;

    if (job_id) {
      // Use existing saved job
      const job = await JobRepository.getById(job_id);
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      if (job.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      finalJobId = job.job_id;
      finalJobTitle = job.job_title;
      finalJobDescription = job.job_description;
    } else if (job_description) {
      // Use provided job description
      finalJobDescription = job_description;

      // Parse job details from description
      // Clean null values from job_details
      const cleanedJobDetails = job_details
        ? JSON.parse(JSON.stringify(job_details, (key, value) =>
            value === null ? undefined : value
          ))
        : undefined;

      const parsedDetails = await parseJobDetails(
        job_description,
        cleanedJobDetails
      );
      finalJobTitle = parsedDetails.job_title;

      // Save job if requested
      if (save_job) {
        await ensureJobsTable();

        // Check job limit for free users
        if (!isPro) {
          try {
            const jobCount = await JobRepository.countUserJobs(user.id);
            if (jobCount >= 10) {
              return NextResponse.json(
                {
                  error:
                    "Cannot save job. Free users can only save 10 jobs. Upgrade to Pro for unlimited jobs.",
                },
                { status: 403 }
              );
            }
          } catch (error) {
            // If table/index doesn't exist yet or other error, allow the save
            // (table might still be creating)
            console.warn("Could not count jobs, allowing save:", error);
          }
        }

        const newJobId = randomUUID();
        const newJob: Job = {
          job_id: newJobId,
          user_id: user.id,
          job_title: parsedDetails.job_title,
          company: parsedDetails.company,
          location: parsedDetails.location,
          employment_type: parsedDetails.employment_type,
          job_description: finalJobDescription,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          await JobRepository.create(newJob);
          finalJobId = newJobId;
        } catch (error) {
          console.warn("Could not save job (table might be creating):", error);
          // Continue without saving the job
        }
      }
    } else {
      return NextResponse.json(
        { error: "Either job_id or job_description must be provided" },
        { status: 400 }
      );
    }

    // Score the CV
    const scoringResult = await scoreCV(cv.parsed_data, finalJobDescription);

    // Create score record
    const scoreId = randomUUID();
    const score: Score = {
      score_id: scoreId,
      user_id: user.id,
      cv_id: cv.cv_id,
      job_id: finalJobId,
      cv_name: cv.cv_name,
      job_title: finalJobTitle,
      overall_score: scoringResult.overall_score,
      category_scores: scoringResult.category_scores,
      strengths: scoringResult.strengths,
      weaknesses: scoringResult.weaknesses,
      recommendations: scoringResult.recommendations,
      created_at: new Date().toISOString(),
    };

    await ScoreRepository.create(score);

    return NextResponse.json(
      {
        message: "CV scored successfully",
        score,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create score error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to score CV",
      },
      { status: 500 }
    );
  }
}
