import { z } from "zod";

export const MAX_JOB_DESCRIPTION_LENGTH = 10000; // characters

export const jobCreateSchema = z.object({
  job_description: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(
      MAX_JOB_DESCRIPTION_LENGTH,
      `Job description cannot exceed ${MAX_JOB_DESCRIPTION_LENGTH} characters`
    ),
  job_title: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  employment_type: z
    .enum(["Remote", "Full Time", "Part Time", "Contract", "Hybrid"])
    .nullable()
    .optional(),
});

export const jobUpdateSchema = z.object({
  job_description: z
    .string()
    .min(50)
    .max(MAX_JOB_DESCRIPTION_LENGTH)
    .optional(),
  job_title: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  employment_type: z
    .enum(["Remote", "Full Time", "Part Time", "Contract", "Hybrid"])
    .nullable()
    .optional(),
});

// Schema for job metadata (without job_description)
export const jobDetailsSchema = z.object({
  job_title: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  employment_type: z
    .enum(["Remote", "Full Time", "Part Time", "Contract", "Hybrid"])
    .nullable()
    .optional(),
});

export const scoreCreateSchema = z.object({
  cv_id: z.string().uuid("Invalid CV ID"),
  job_id: z.string().uuid("Invalid Job ID").nullable().optional(),
  job_description: z.string().nullable().optional(),
  save_job: z.boolean().default(false),
  job_details: jobDetailsSchema.nullable().optional(),
}).refine(
  (data) => data.job_id || data.job_description,
  {
    message: "Either job_id or job_description must be provided",
  }
);
