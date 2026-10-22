import apiClient from "@/lib/apiClient";
import type {
  ReviewInput,
  Submission,
  SubmissionStats,
  TSubmissionStatus,
} from "@/types/submissions.type";

export type TGetSubmissionsParams = {
  page: number;
  limit: number;
  status?: TSubmissionStatus;
};

export async function getAllSubmissions(params: TGetSubmissionsParams) {
  const response = await apiClient<{ submissions: Submission[] }>(
    "/submissions",
    { query: params },
  );
  return {
    submissions: response.data.submissions,
    totalPages: response.meta?.totalPages ?? 1,
  };
}

export async function getStats() {
  const response = await apiClient<{ stats: SubmissionStats }>(
    "/submissions/stats",
  );
  return response.data.stats;
}

export async function reviewSubmission(id: string, input: ReviewInput) {
  const response = await apiClient<{ submission: Submission }>(
    `/submissions/${id}/review`,
    { method: "PATCH", body: input },
  );
  return response.data.submission;
}
