export type TSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  status: TSubmissionStatus;
  review_comment: string | null;
  reviewed_at: string | null;
  user_id: string;
  user?: SubmissionUser;
  created_at: string;
}

export interface CreateSubmissionInput {
  project_name: string;
  repo_url: string;
  live_link?: string;
  description: string;
}

export type TReviewStatus = Exclude<TSubmissionStatus, "PENDING">;

export interface ReviewInput {
  status: TReviewStatus;
  comment?: string;
}

export interface SubmissionStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
