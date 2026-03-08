export interface User {
  id: string;
  email: string;
  full_name: string;
  profile_picture_url?: string;
  subscription_tier: "free" | "pro";
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  cvs_count: number;
  scores_this_month: number;
  subscription_status?: "active" | "canceled" | "past_due";
}
