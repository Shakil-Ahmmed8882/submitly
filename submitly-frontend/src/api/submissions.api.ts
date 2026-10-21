import apiClient from "@/lib/apiClient";
import type { CreateSubmissionInput, Submission } from "@/types/submissions.type";

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
