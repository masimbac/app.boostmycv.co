import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CVRepository } from "@/lib/db/cv-repository";
import { ensureCVsTable } from "@/lib/db/table-setup";
import { extractText } from "@/lib/parsers/text-extractor";
import { parseCV } from "@/lib/parsers/ai-parser";
import { uploadCVToS3 } from "@/lib/storage/s3";
import {
  validateFileType,
  validateFileSize,
} from "@/lib/validation/cv-validation";
import { CV } from "@/types/cv";
import { randomUUID } from "crypto";

// GET /api/v1/cvs - List user's CVs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureCVsTable();

    const cvs = await CVRepository.getByUserId(user.id);

    return NextResponse.json({ cvs }, { status: 200 });
  } catch (error) {
    console.error("List CVs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/cvs - Upload and parse CV
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to check subscription tier
    const profileResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/users/${user.id}`,
      {
        headers: { Cookie: request.headers.get("cookie") || "" },
      }
    );
    const { user: userProfile } = await profileResponse.json();
    const isPro = userProfile.subscription_tier === "pro";

    await ensureCVsTable();

    // Check CV count limit for free users
    if (!isPro) {
      const cvCount = await CVRepository.countUserCVs(user.id);
      if (cvCount >= 2) {
        return NextResponse.json(
          {
            error:
              "Free users can only have 2 CVs. Upgrade to Pro for unlimited CVs.",
          },
          { status: 403 }
        );
      }
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const cvName = formData.get("cv_name") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!cvName || cvName.trim().length === 0) {
      return NextResponse.json(
        { error: "CV name is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF and Word documents are accepted.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file.size)) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from file
    const text = await extractText(buffer, file.type);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from file. Please ensure the file contains readable text.",
        },
        { status: 400 }
      );
    }

    // Parse CV with AI
    const parsedData = await parseCV(text);

    // Generate CV ID
    const cvId = randomUUID();

    // Upload file to S3
    const fileUrl = await uploadCVToS3(
      cvId,
      user.id,
      buffer,
      file.name,
      file.type
    );

    // Create CV record
    const cv: CV = {
      cv_id: cvId,
      user_id: user.id,
      cv_name: cvName.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parsed_data: parsedData,
      original_file_url: fileUrl,
      version: 1,
    };

    await CVRepository.create(cv);

    return NextResponse.json(
      {
        message: "CV uploaded and parsed successfully",
        cv: {
          cv_id: cv.cv_id,
          cv_name: cv.cv_name,
          created_at: cv.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload CV error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload and parse CV",
      },
      { status: 500 }
    );
  }
}
