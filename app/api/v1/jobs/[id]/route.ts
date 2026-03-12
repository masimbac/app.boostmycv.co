import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { JobRepository } from "@/lib/db/job-repository";
import { ensureJobsTable } from "@/lib/db/table-setup";
import { jobUpdateSchema } from "@/lib/validation/job-validation";

// GET /api/v1/jobs/:id - Get job details
export async function GET(
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

    await ensureJobsTable();

    const job = await JobRepository.getById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ensure user owns this job
    if (job.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/jobs/:id - Update job
export async function PUT(
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

    await ensureJobsTable();

    const job = await JobRepository.getById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validation = jobUpdateSchema.safeParse(body);
    if (!validation.success) {
      console.error("Job validation failed:", JSON.stringify(validation.error.issues, null, 2));
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Transform null values to undefined for compatibility
    const cleanedData = JSON.parse(JSON.stringify(validation.data, (key, value) =>
      value === null ? undefined : value
    ));

    await JobRepository.update(id, cleanedData);

    return NextResponse.json(
      { message: "Job updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/jobs/:id - Delete job
export async function DELETE(
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

    await ensureJobsTable();

    const job = await JobRepository.getById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await JobRepository.delete(id);

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
