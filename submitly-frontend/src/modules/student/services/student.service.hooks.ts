"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as student from "./student.service";

export const mySubmissionsQueryKey = ["submissions", "mine"] as const;

export function useMySubmissions() {
  return useQuery({
    queryKey: mySubmissionsQueryKey,
    queryFn: student.getMySubmissions,
  });
}

export function useCreateSubmission() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: student.createSubmission,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: mySubmissionsQueryKey });
      toast.success("Project submitted successfully.");
    },
  });
}
