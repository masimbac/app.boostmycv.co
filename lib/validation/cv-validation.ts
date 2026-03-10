import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export function validateFileType(mimeType: string): boolean {
  return ACCEPTED_FILE_TYPES.includes(mimeType);
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export const cvUpdateSchema = z.object({
  cv_name: z
    .string()
    .min(1, "CV name is required")
    .max(100, "CV name too long"),
  parsed_data: z.object({
    personal_info: z.object({
      full_name: z.string(),
      email: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      location: z.string().nullable().optional(),
      linkedin: z.string().nullable().optional(),
      portfolio: z.string().nullable().optional(),
    }).passthrough(),
    professional_summary: z.string().nullable().optional(),
    work_experience: z.array(z.any()).default([]),
    education: z.array(z.any()).default([]),
    skills: z.object({
      technical: z.array(z.string()).optional().default([]),
      soft: z.array(z.string()).optional().default([]),
      languages: z.array(z.string()).optional().default([]),
      certifications: z.array(z.string()).optional().default([]),
    }).passthrough(),
    projects: z.array(z.any()).default([]),
    certifications: z.array(z.any()).default([]),
    awards: z.array(z.string()).default([]),
    publications: z.array(z.string()).default([]),
    volunteer_experience: z.array(z.string()).default([]),
  }).passthrough(),
});
