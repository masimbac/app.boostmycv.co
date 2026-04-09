export type ChangeType = "modify" | "add" | "remove" | "reorder";

export type ChangeSection =
  | "personal_info"
  | "professional_summary"
  | "work_experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

export interface Change {
  change_id: string;
  section: ChangeSection;
  type: ChangeType;
  path: string;
  before: unknown;
  after: unknown;
  reasoning: string;
  accepted: boolean;
  field_label: string;
}

export interface Boost {
  boost_id: string;
  user_id: string;
  score_id: string;
  cv_id: string;
  cv_name: string;
  job_title: string;
  original_score: number;
  original_cv_version: number;
  boosted_cv_version: number | null;
  changes: Change[];
  status: "pending" | "applied" | "rejected";
  changes_accepted: number;
  changes_rejected: number;
  estimated_new_score: number;
  created_at: string;
  applied_at: string | null;
}

export interface BoostListItem {
  boost_id: string;
  cv_name: string;
  job_title: string;
  changes_count: number;
  status: string;
  created_at: string;
}
