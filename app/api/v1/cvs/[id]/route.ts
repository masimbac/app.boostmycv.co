import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CVRepository } from "@/lib/db/cv-repository";
import { ensureCVsTable } from "@/lib/db/table-setup";
import { deleteCVFromS3 } from "@/lib/storage/s3";
import { cvUpdateSchema } from "@/lib/validation/cv-validation";

// GET /api/v1/cvs/:id - Get CV by ID
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

    await ensureCVsTable();

    const cv = await CVRepository.getById(id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Ensure user owns this CV
    if (cv.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ cv }, { status: 200 });
  } catch (error) {
    console.error("Get CV error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/cvs/:id - Update CV
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

    await ensureCVsTable();

    const cv = await CVRepository.getById(id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (cv.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validation = cvUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { cv_name, parsed_data } = validation.data;

    await CVRepository.update(id, cv_name, parsed_data);

    return NextResponse.json(
      { message: "CV updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update CV error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/cvs/:id - Delete CV
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

    await ensureCVsTable();

    const cv = await CVRepository.getById(id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (cv.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract filename from URL
    const urlParts = cv.original_file_url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    // Delete from S3
    await deleteCVFromS3(id, user.id, fileName);

    // Delete from DynamoDB
    await CVRepository.delete(id);

    return NextResponse.json(
      { message: "CV deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete CV error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
