import manifest from "@/templates/manifest.json";
import metaAwesomeCv from "@/templates/awesome-cv/meta.json";

export type TemplateMeta = {
  id: string;
  display_name: string;
  short_description?: string;
  latex_engine?: string;
  paper?: string;
  upstream?: {
    name: string;
    repository: string;
    license?: string;
    compile_note?: string;
  };
  sections_supported?: string[];
  file_output?: { primary_tex?: string };
};

const metaById: Record<string, TemplateMeta> = {
  [metaAwesomeCv.id]: metaAwesomeCv as TemplateMeta,
};

export function getDefaultTemplateId(): string {
  return manifest.default_template_id;
}

export function listTemplateIds(): string[] {
  return manifest.templates.map((t) => t.id);
}

export function getTemplateMeta(templateId: string): TemplateMeta | null {
  return metaById[templateId] ?? null;
}

export function resolveTemplateId(requested?: string | null): string {
  if (requested && metaById[requested]) return requested;
  return manifest.default_template_id;
}
