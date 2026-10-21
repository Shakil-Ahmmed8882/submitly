"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMySubmissions } from "@/hooks/submissions.hook";
import { routes } from "@/routes";
import type { Submission } from "@/types/submissions.type";

const STATUS_CONFIG: Record<
  Submission["status"],
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  PENDING: {
    icon: Clock,
    label: "Pending review",
    className:
      "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  },
  APPROVED: {
    icon: CheckCircle2,
    label: "Approved",
    className:
      "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  },
  REJECTED: {
    icon: XCircle,
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

export function SubmissionDetail({ id }: { id: string }) {
  const { data, isPending } = useMySubmissions();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Link
          href={routes.submissions}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to submissions
        </Link>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 animate-pulse rounded-lg bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  const sub = data?.find((s) => s.id === id);

  if (!sub) {
    return (
      <div className="space-y-4">
        <Link
          href={routes.submissions}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to submissions
        </Link>
        <p className="text-sm text-muted-foreground">Submission not found.</p>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[sub.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={routes.submissions}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to submissions
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Submission</p>
            <h1 className="text-display-lg tracking-[-0.04em]">
              {sub.project_name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Submitted {formatDate(sub.created_at)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cfg.className}`}
          >
            <StatusIcon className="size-4" aria-hidden="true" />
            {cfg.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="rounded-lg bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-medium">Description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {sub.description}
            </p>
          </section>

          <section className="rounded-lg bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-medium">Links</h2>
            <div className="space-y-2">
              <a
                href={sub.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Link2 className="size-4" aria-hidden="true" />
                GitHub repository
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
              {sub.live_link && (
                <a
                  href={sub.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Live demo
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-sm font-medium">Mentor feedback</h2>
            </div>
            {sub.review_comment ? (
              <>
                {sub.reviewed_at && (
                  <p className="mb-3 text-xs text-muted-foreground">
                    Reviewed on {formatDate(sub.reviewed_at)}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sub.review_comment}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Awaiting mentor review. You'll be notified when feedback is
                ready.
              </p>
            )}
          </section>

          <Button asChild className="w-full" variant="outline">
            <Link href={routes.create}>Submit another project</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
