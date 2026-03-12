import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { JobRepository } from "@/lib/db/job-repository";
import { ensureJobsTable } from "@/lib/db/table-setup";
import { jobCreateSchema } from "@/lib/validation/job-validation";
import { parseJobDetails } from "@/lib/ai/job-parser";
import { Job } from "@/types/job";
import { randomUUID } from "crypto";

// GET /api/v1/jobs - List user's jobs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureJobsTable();

    const jobs = await JobRepository.getByUserId(user.id);

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("List jobs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/jobs - Create job with AI inference
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription limits for free users
    const profileResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/${user.id}`,
      {
        headers: { Cookie: request.headers.get("cookie") || "" },
      }
    );
    const { user: userProfile } = await profileResponse.json();
    const isPro = userProfile.subscription_tier === "pro";

    await ensureJobsTable();

    // Check job count limit for free users (10 jobs max)
    if (!isPro) {
      const jobCount = await JobRepository.countUserJobs(user.id);
      if (jobCount >= 10) {
        return NextResponse.json(
          {
            error:
              "Free users can only save 10 jobs. Upgrade to Pro for unlimited jobs.",
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    // Validate request body
    const validation = jobCreateSchema.safeParse(body);
    if (!validation.success) {
      console.error("Job validation failed:", JSON.stringify(validation.error.issues, null, 2));
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { job_description, job_title, company, location, employment_type } =
      validation.data;

    // Use AI to infer missing details
    const parsedDetails = await parseJobDetails(job_description, {
      job_title: job_title || undefined,
      company: company || undefined,
      location: location || undefined,
      employment_type: employment_type || undefined,
    });

    // Create job record
    const jobId = randomUUID();
    const job: Job = {
      job_id: jobId,
      user_id: user.id,
      job_title: parsedDetails.job_title,
      company: parsedDetails.company,
      location: parsedDetails.location,
      employment_type: parsedDetails.employment_type,
      job_description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await JobRepository.create(job);

    return NextResponse.json(
      {
        message: "Job saved successfully",
        job: {
          job_id: job.job_id,
          job_title: job.job_title,
          company: job.company,
          location: job.location,
          employment_type: job.employment_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create job",
      },
      { status: 500 }
    );
  }
}
