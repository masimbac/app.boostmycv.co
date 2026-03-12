export interface CategoryScores {
  skills_match: number;
  experience_match: number;
  education_match: number;
  keywords_match: number;
}

export interface Score {
  score_id: string;
  user_id: string;
  cv_id: string;
  job_id?: string;
  cv_name: string;
  job_title: string;
  overall_score: number;
  category_scores: CategoryScores;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  created_at: string;
}

export interface ScoreListItem {
  score_id: string;
  cv_name: string;
  job_title: string;
  overall_score: number;
  created_at: string;
}
