import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import {
  AWESOME_CV_CLS_FILENAME,
  getAwesomeCvClsSourcePath,
} from "@/lib/pdf/awesome-cv-paths";

/**
 * GET /api/v1/templates/awesome-cv/cls — vendored Awesome-CV class file (LPPL).
 * Same file is copied next to generated resume.tex; use this URL to download it for Overleaf.
 */
export async function GET() {
  try {
    const buf = await readFile(getAwesomeCvClsSourcePath());
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${AWESOME_CV_CLS_FILENAME}"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Template cls read error:", error);
    return NextResponse.json(
      { error: "Template class file not found on server" },
      { status: 500 }
    );
  }
}
