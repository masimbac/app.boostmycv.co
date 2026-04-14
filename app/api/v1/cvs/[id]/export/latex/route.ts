import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CVRepository } from "@/lib/db/cv-repository";
import { ensureCVsTable } from "@/lib/db/table-setup";
import { generateCvLatex } from "@/lib/pdf/generate-cv-latex";
import { writeLatexToTmp } from "@/lib/pdf/write-latex-to-tmp";
import { getTemplateMeta, listTemplateIds } from "@/lib/templates/registry";

function slugFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "resume"
  );
}

// GET /api/v1/cvs/:id/export/latex — preview JSON or ?download=1 for .tex file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cvId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureCVsTable();
    const cv = await CVRepository.getById(cvId);
    if (!cv || cv.user_id !== user.id) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const template_param = url.searchParams.get("template") || undefined;
    const download = url.searchParams.get("download") === "1";

    const { template_id, latex } = generateCvLatex(
      template_param,
      cv.parsed_data,
      cv.cv_name
    );

    const meta = getTemplateMeta(template_id);
    const write = await writeLatexToTmp(latex, meta?.file_output?.primary_tex || "resume.tex");

    if (download) {
      const fname = `${slugFilename(cv.cv_name)}-${template_id}.tex`;
      return new NextResponse(latex, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fname}"`,
        },
      });
    }

    return NextResponse.json(
      {
        template_id,
        template: meta,
        output_path: write.absolute_path,
        cls_output_path: write.cls_absolute_path,
        output_directory: write.directory,
        cls_download_url: "/api/v1/templates/awesome-cv/cls",
        available_templates: listTemplateIds(),
        latex,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Export LaTeX error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/cvs/:id/export/latex — same as GET JSON body
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cvId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureCVsTable();
    const cv = await CVRepository.getById(cvId);
    if (!cv || cv.user_id !== user.id) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    let template_param: string | undefined;
    try {
      const body = await request.json();
      template_param = body?.template_id ?? body?.template;
    } catch {
      template_param = undefined;
    }

    const { template_id, latex } = generateCvLatex(
      template_param,
      cv.parsed_data,
      cv.cv_name
    );

    const meta = getTemplateMeta(template_id);
    const write = await writeLatexToTmp(latex, meta?.file_output?.primary_tex || "resume.tex");

    return NextResponse.json(
      {
        template_id,
        template: meta,
        output_path: write.absolute_path,
        cls_output_path: write.cls_absolute_path,
        output_directory: write.directory,
        cls_download_url: "/api/v1/templates/awesome-cv/cls",
        available_templates: listTemplateIds(),
        latex,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Export LaTeX error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
