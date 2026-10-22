"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as submissionsApi from "@/api/submissions.api";
import { useSession } from "@/hooks/auth.hook";
import type { CreateSubmissionInput } from "@/types/submissions.type";

export const submissionsQueryKey = ["submissions"] as const;

export function useMySubmissions() {
  const { data: user } = useSession();
  const isMentor = user?.role === "MENTOR";
  const queryFn = (): Promise<import("@/types/submissions.type").Submission[]> =>
    isMentor
      ? submissionsApi.getAllSubmissions().then((r) => r.submissions)
      : submissionsApi.getMySubmissions();
  return useQuery({
    queryKey: [...submissionsQueryKey, isMentor ? "all" : "mine"] as string[],
    queryFn,
    enabled: !!user,
  });
}

export function useCreateSubmission() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubmissionInput) =>
      submissionsApi.createSubmission(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: submissionsQueryKey, exact: false });
      toast.success("Project submitted successfully.");
    },
  });
}
