import { z } from "zod";

export const boostCreateSchema = z.object({
  score_id: z.string().uuid("Invalid Score ID"),
});

export const changeAcceptanceSchema = z.object({
  change_id: z.string().uuid("Invalid Change ID"),
  accepted: z.boolean(),
});

export const boostApplySchema = z.object({
  cv_name: z
    .string()
    .min(1, "CV name is required")
    .max(100, "CV name must be 100 characters or less")
    .optional(),
  parsed_data: z
    .object({
      personal_info: z.object({ full_name: z.string() }).passthrough(),
      professional_summary: z.string().nullable().optional().transform(v => v ?? undefined),
      work_experience: z.array(z.any()).default([]),
      education: z.array(z.any()).default([]),
      skills: z
        .object({
          technical: z.array(z.string()).optional().default([]),
          soft: z.array(z.string()).optional().default([]),
          languages: z.array(z.string()).optional().default([]),
          certifications: z.array(z.string()).optional().default([]),
        })
        .passthrough(),
      projects: z.array(z.any()).default([]),
      certifications: z.array(z.any()).default([]),
      awards: z.array(z.any()).default([]),
      publications: z.array(z.any()).default([]),
      volunteer_experience: z.array(z.any()).default([]),
    })
    .passthrough()
    .optional(),
  changes_accepted: z.number().int().min(0).optional(),
});
