export type EmploymentType =
  | "Remote"
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Hybrid";

export interface Job {
  job_id: string;
  user_id: string;
  job_title: string;
  company?: string;
  location?: string;
  employment_type?: EmploymentType;
  job_description: string;
  created_at: string;
  updated_at: string;
}

export interface JobListItem {
  job_id: string;
  job_title: string;
  company?: string;
  created_at: string;
}
