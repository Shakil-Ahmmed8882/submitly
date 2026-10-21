export interface Submission {
  id: string;
  project_name: string;
  repo_url: string;
  live_link: string | null;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  review_comment: string | null;
  reviewed_by_id: string | null;
  reviewed_at: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubmissionInput {
  project_name: string;
  repo_url: string;
  live_link?: string;
  description: string;
}
