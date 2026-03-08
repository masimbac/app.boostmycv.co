export interface PersonalInfo {
  full_name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  honors: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  credential_id?: string;
}

export interface ParsedCVData {
  personal_info: PersonalInfo;
  professional_summary?: string;
  work_experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  awards: string[];
  publications: string[];
  volunteer_experience: string[];
}

export interface CV {
  cv_id: string;
  user_id: string;
  cv_name: string;
  created_at: string;
  updated_at: string;
  parsed_data: ParsedCVData;
  original_file_url: string;
  version: number;
  parent_cv_id?: string;
}

export interface CVListItem {
  cv_id: string;
  cv_name: string;
  created_at: string;
  updated_at: string;
  version: number;
}
