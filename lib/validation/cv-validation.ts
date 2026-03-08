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
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      linkedin: z.string().optional(),
      portfolio: z.string().optional(),
    }),
    professional_summary: z.string().optional(),
    work_experience: z.array(z.any()),
    education: z.array(z.any()),
    skills: z.object({
      technical: z.array(z.string()),
      soft: z.array(z.string()),
      languages: z.array(z.string()),
      certifications: z.array(z.string()),
    }),
    projects: z.array(z.any()),
    certifications: z.array(z.any()),
    awards: z.array(z.string()),
    publications: z.array(z.string()),
    volunteer_experience: z.array(z.string()),
  }),
});
