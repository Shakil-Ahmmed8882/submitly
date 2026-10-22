export interface SubmissionUser {
  id: string;
  name: string;
  email: string;
}

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
  user?: SubmissionUser;
  created_at: string;
  updated_at: string;
}

export interface CreateSubmissionInput {
  project_name: string;
  repo_url: string;
  live_link?: string;
  description: string;
}

export interface ReviewInput {
  status: "APPROVED" | "REJECTED";
  review_comment?: string;
}

export interface SubmissionStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
