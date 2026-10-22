"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dropdown } from "@/components/reusable-ui-blocks/dropdown/Dropdown";
import { Button } from "@/components/ui/button";
import * as submissionsApi from "@/api/submissions.api";
import type { Submission } from "@/types/submissions.type";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_BADGE: Record<
  Submission["status"],
  { label: string; className: string; icon: typeof Clock }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
    icon: XCircle,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statsQueryKey = ["submissions", "stats"] as const;
const allSubmissionsQueryKey = (status: StatusFilter, page: number) =>
  ["submissions", "all", status, page] as const;

function StatCard({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-semibold tabular-nums ${className ?? ""}`}>{value}</p>
    </div>
  );
}

function ReviewModal({
  submission,
  onClose,
}: {
  submission: Submission;
  onClose: () => void;
}) {
  const client = useQueryClient();
  const [comment, setComment] = useState(submission.review_comment ?? "");

  const mutation = useMutation({
    mutationFn: (status: "APPROVED" | "REJECTED") =>
      submissionsApi.reviewSubmission(submission.id, { status, review_comment: comment || undefined }),
    onSuccess: (_, status) => {
      client.invalidateQueries({ queryKey: ["submissions"], exact: false });
      toast.success(`Submission ${status === "APPROVED" ? "approved" : "rejected"}.`);
      onClose();
    },
    onError: () => toast.error("Failed to update. Please try again."),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 className="mb-1 text-base font-semibold">{submission.project_name}</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          {submission.user?.name ?? "Student"} · {formatDate(submission.created_at)}
        </p>

        <div className="mb-4 space-y-2 text-sm">
          <a
            href={submission.repo_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
          >
            Repository <ExternalLink className="size-3" aria-hidden="true" />
          </a>
          {submission.live_link && (
            <>
              {" · "}
              <a
                href={submission.live_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
              >
                Live demo <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            </>
          )}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">{submission.description}</p>

        <label htmlFor="review-comment" className="mb-1 block text-xs font-medium">
          Feedback comment <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Leave structured feedback for the student…"
          className="mb-5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate("REJECTED")}
            disabled={mutation.isPending}
          >
            Reject
          </Button>
          <Button
            onClick={() => mutation.mutate("APPROVED")}
            disabled={mutation.isPending}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MentorReviewDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Submission | null>(null);
  const LIMIT = 10;

  const { data: stats } = useQuery({
    queryKey: statsQueryKey,
    queryFn: submissionsApi.getStats,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: allSubmissionsQueryKey(statusFilter, page),
    queryFn: () =>
      submissionsApi.getAllSubmissions({
        page,
        limit: LIMIT,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      }),
  });

  const submissions = data?.submissions ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-3">Mentor</p>
        <h1 className="text-display-lg tracking-[-0.04em]">Review dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review student submissions and leave structured feedback.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total submissions" value={stats.total} />
          <StatCard label="Pending review" value={stats.pending} className="text-amber-400" />
          <StatCard label="Approved" value={stats.approved} className="text-emerald-400" />
          <StatCard label="Rejected" value={stats.rejected} className="text-red-400" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <Dropdown
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          align="start"
          trigger={
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground transition-colors hover:bg-accent"
            >
              {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
              <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </button>
          }
        />
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">Failed to load submissions</p>
          <p className="mt-1 text-sm text-muted-foreground">Please try refreshing.</p>
        </div>
      ) : isPending ? (
        <div className="rounded-lg bg-card shadow-card divide-y divide-border">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-4 px-5 py-4">
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No submissions found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different filter.</p>
        </div>
      ) : (
        <div className="rounded-lg bg-card shadow-card">
          <div className="hidden grid-cols-[1fr_160px_110px_80px] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Project</span>
            <span>Student</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          <div className="divide-y divide-border">
            {submissions.map((sub) => {
              const badge = STATUS_BADGE[sub.status];
              const BadgeIcon = badge.icon;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelected(sub)}
                  className="w-full flex flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-accent/40 sm:grid sm:grid-cols-[1fr_160px_110px_80px] sm:items-center sm:gap-4"
                >
                  <p className="truncate text-sm font-medium">{sub.project_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {sub.user?.name ?? "—"}
                  </p>
                  <span className={`w-fit inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                    <BadgeIcon className="size-3" aria-hidden="true" />
                    {badge.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{formatDate(sub.created_at)}</p>
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected && (
        <ReviewModal submission={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
