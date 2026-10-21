"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as submissionsApi from "@/api/submissions.api";
import type { CreateSubmissionInput } from "@/types/submissions.type";

export const submissionsQueryKey = ["submissions", "mine"] as const;

export function useMySubmissions() {
  return useQuery({
    queryKey: submissionsQueryKey,
    queryFn: submissionsApi.getMySubmissions,
  });
}

export function useCreateSubmission() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubmissionInput) =>
      submissionsApi.createSubmission(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: submissionsQueryKey });
      toast.success("Project submitted successfully.");
    },
  });
}
