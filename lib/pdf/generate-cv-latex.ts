import { ParsedCVData } from "@/types/cv";
import { buildAwesomeCvLatex } from "@/lib/pdf/awesome-cv-latex";
import { resolveTemplateId } from "@/lib/templates/registry";

export function generateCvLatex(
  templateId: string | undefined,
  parsed: ParsedCVData,
  cvName: string
): { template_id: string; latex: string } {
  const id = resolveTemplateId(templateId);
  const latex = buildAwesomeCvLatex(parsed, cvName);
  return { template_id: id, latex };
}
