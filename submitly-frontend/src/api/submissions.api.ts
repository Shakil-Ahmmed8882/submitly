import apiClient from "@/lib/apiClient";
import type {
  CreateSubmissionInput,
  ReviewInput,
  Submission,
  SubmissionStats,
} from "@/types/submissions.type";

export async function createSubmission(input: CreateSubmissionInput) {
  return (
    await apiClient<{ submission: Submission }>("/submissions", {
      method: "POST",
      body: input,
    })
  ).data.submission;
}

export async function getMySubmissions() {
  return (await apiClient<{ submissions: Submission[] }>("/submissions/mine"))
    .data.submissions;
}

export type GetAllParams = {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
};

export async function getAllSubmissions(params: GetAllParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  const qs = query.toString();
  const res = await apiClient<{ submissions: Submission[] }>(
    `/submissions${qs ? `?${qs}` : ""}`,
  );
  return {
    submissions: res.data.submissions,
    total: res.meta?.total ?? 0,
    totalPages: res.meta?.totalPages ?? 1,
  };
}

export async function getStats() {
  return (await apiClient<{ stats: SubmissionStats }>("/submissions/stats"))
    .data.stats;
}

export async function reviewSubmission(id: string, input: ReviewInput) {
  return (
    await apiClient<{ submission: Submission }>(`/submissions/${id}/review`, {
      method: "PATCH",
      body: input,
    })
  ).data.submission;
}
