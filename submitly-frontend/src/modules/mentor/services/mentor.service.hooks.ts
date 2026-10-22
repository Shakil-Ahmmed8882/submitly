"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { toApiError } from "@/lib/api-error";
import type { ReviewInput, TSubmissionStatus } from "@/types/submissions.type";
import * as mentor from "./mentor.service";

export const PAGE_SIZE = 10;

const submissionsKey = ["submissions"] as const;
const statsKey = ["submissions", "stats"] as const;

export function useSubmissionStats() {
  return useQuery({ queryKey: statsKey, queryFn: mentor.getStats });
}

export function useAllSubmissions(page: number, status?: TSubmissionStatus) {
  return useQuery({
    queryKey: [...submissionsKey, "all", status ?? "ALL", page],
    queryFn: () => mentor.getAllSubmissions({ page, limit: PAGE_SIZE, status }),
    placeholderData: keepPreviousData,
  });
}

export function useReviewSubmission() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; input: ReviewInput }) =>
      mentor.reviewSubmission(args.id, args.input),
    onSuccess: (_, args) => {
      void client.invalidateQueries({ queryKey: submissionsKey });
      toast.success(
        args.input.status === "APPROVED"
          ? "Submission approved."
          : "Submission rejected.",
      );
    },
    onError: (error) => toast.error(toApiError(error).userMessage),
  });
}
