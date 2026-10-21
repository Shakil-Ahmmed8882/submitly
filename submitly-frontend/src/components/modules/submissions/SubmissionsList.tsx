"use client";

import { ArrowRight, ChevronDown, FileText, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dropdown } from "@/components/reusable-ui-blocks/dropdown/Dropdown";
import { useMySubmissions } from "@/hooks/submissions.hook";
import { routes } from "@/routes";
import type { Submission } from "@/types/submissions.type";

type StatusFilter = "All" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "All", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_BADGE: Record<
  Submission["status"],
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function SubmissionsList() {
  const { data, isPending, isError } = useMySubmissions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filtered = (data ?? []).filter((s) => {
    const matchSearch = s.project_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-3">Projects</p>
        <h1 className="text-display-lg tracking-[-0.04em]">My submissions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All your submitted projects and mentor feedback.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-48 flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search submissions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Dropdown
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          align="start"
          trigger={
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground transition-colors hover:bg-accent"
            >
              {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
              <ChevronDown
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </button>
          }
        />
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">Failed to load submissions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      ) : isPending ? (
        <div className="rounded-lg bg-card shadow-card divide-y divide-border">
          {[1, 2, 3].map((n) => (
            <SkeletonRow key={n} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <FileText
            className="mb-3 size-10 text-muted-foreground"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium">No submissions found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data?.length === 0
              ? "You haven't submitted any projects yet."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-card shadow-card">
          <div className="hidden grid-cols-[1fr_110px_100px_40px] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Project</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>
          <div className="divide-y divide-border">
            {filtered.map((sub) => {
              const badge = STATUS_BADGE[sub.status];
              return (
                <Link
                  key={sub.id}
                  href={routes.submissionDetail(sub.id)}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-accent/40 sm:grid sm:grid-cols-[1fr_110px_100px_40px] sm:items-center sm:gap-4"
                >
                  <p className="truncate text-sm font-medium">
                    {sub.project_name}
                  </p>
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(sub.created_at)}
                  </p>
                  <ArrowRight
                    className="hidden size-4 text-muted-foreground sm:block"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
