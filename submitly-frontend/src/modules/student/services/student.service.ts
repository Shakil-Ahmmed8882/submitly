import apiClient from "@/lib/apiClient";
import type {
  CreateSubmissionInput,
  Submission,
} from "@/types/submissions.type";

export async function createSubmission(input: CreateSubmissionInput) {
  const response = await apiClient<{ submission: Submission }>("/submissions", {
    method: "POST",
    body: input,
  });
  return response.data.submission;
}

export async function getMySubmissions() {
  const response = await apiClient<{ submissions: Submission[] }>(
    "/submissions/mine",
  );
  return response.data.submissions;
}
