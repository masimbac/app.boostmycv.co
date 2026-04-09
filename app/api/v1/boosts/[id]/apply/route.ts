import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BoostRepository } from "@/lib/db/boost-repository";
import { CVRepository } from "@/lib/db/cv-repository";
import { ensureBoostsTable, ensureCVsTable } from "@/lib/db/table-setup";
import { boostApplySchema } from "@/lib/validation/boost-validation";
import { CV } from "@/types/cv";
import { randomUUID } from "crypto";

// POST /api/v1/boosts/:id/apply - Apply boost changes to create new CV version
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureBoostsTable();
    await ensureCVsTable();

    const boost = await BoostRepository.getById(id);

    if (!boost) {
      return NextResponse.json({ error: "Boost not found" }, { status: 404 });
    }

    if (boost.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (boost.status === "applied") {
      return NextResponse.json(
        { error: "Boost has already been applied" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validation = boostApplySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const originalCV = await CVRepository.getById(boost.cv_id);
    if (!originalCV) {
      return NextResponse.json(
        { error: "Original CV not found" },
        { status: 404 }
      );
    }

    const parsedData = validation.data.parsed_data;
    if (!parsedData) {
      return NextResponse.json(
        { error: "parsed_data is required" },
        { status: 400 }
      );
    }

    const newCVId = randomUUID();
    const cvName =
      validation.data.cv_name ||
      `${originalCV.cv_name} (Boosted for ${boost.job_title})`;

    const newCV: CV = {
      cv_id: newCVId,
      user_id: user.id,
      cv_name: cvName,
      original_file_url: originalCV.original_file_url,
      parsed_data: parsedData,
      version: originalCV.version + 1,
      parent_cv_id: originalCV.cv_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await CVRepository.create(newCV);

    const acceptedCount = body.changes_accepted ?? 0;
    const rejectedCount = (boost.changes?.length ?? 0) - acceptedCount;

    await BoostRepository.update(id, {
      status: "applied",
      applied_at: new Date().toISOString(),
      boosted_cv_version: newCV.version,
      changes_accepted: acceptedCount,
      changes_rejected: rejectedCount,
    });

    return NextResponse.json(
      {
        message: "Boost applied successfully",
        cv: newCV,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Apply boost error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to apply boost",
      },
      { status: 500 }
    );
  }
}
