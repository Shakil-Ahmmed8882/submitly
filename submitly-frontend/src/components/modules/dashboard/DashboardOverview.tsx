"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  MessageSquare,
  PenSquare,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import * as submissionsApi from "@/api/submissions.api";
import { useSession } from "@/hooks/auth.hook";
import { routes } from "@/routes";
import { MentorReviewDashboard } from "@/components/modules/admin/MentorReviewDashboard";

const studentQuickLinks = [
  {
    title: "Submit a project",
    description: "Share your work with your mentor for review.",
    href: routes.create,
    icon: PenSquare,
  },
  {
    title: "My submissions",
    description: "View all your submitted projects and their status.",
    href: routes.submissions,
    icon: ClipboardList,
  },
  {
    title: "Latest feedback",
    description: "Read what your mentor said about your last project.",
    href: routes.submissions,
    icon: MessageSquare,
  },
];

const STAT_CONFIG = [
  { key: "total" as const, label: "Total submissions", icon: FileText, className: "text-foreground" },
  { key: "pending" as const, label: "Pending review", icon: Clock, className: "text-amber-400" },
  { key: "approved" as const, label: "Approved", icon: CheckCircle2, className: "text-emerald-400" },
  { key: "rejected" as const, label: "Rejected", icon: XCircle, className: "text-red-400" },
];

function MentorStats() {
  const { data, isPending } = useQuery({
    queryKey: ["submissions", "stats"],
    queryFn: submissionsApi.getStats,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, className }) => (
        <div key={key} className="rounded-lg bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <Icon className={`size-4 ${className}`} strokeWidth={1.5} aria-hidden="true" />
          </div>
          {isPending ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-3 text-2xl font-semibold tabular-nums">{data?.[key] ?? 0}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const session = useSession();
  if (!session.data) return null;
  const user = session.data;
  const isMentor = user.role === "MENTOR";

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="eyebrow mb-3">Overview</p>
          <h1 className="break-words text-display-lg tracking-[-0.04em]">
            Welcome back, {user.name}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isMentor
              ? "Review student submissions and leave structured feedback."
              : "Track your projects and mentor feedback, all in one place."}
          </p>
        </div>
        {!isMentor && (
          <Button asChild>
            <Link href={routes.create}>
              <PenSquare aria-hidden="true" />
              Submit project
            </Link>
          </Button>
        )}
      </header>

      {isMentor ? (
        <>
          <MentorStats />
          <MentorReviewDashboard />
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studentQuickLinks.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-lg bg-card p-5 shadow-card transition-shadow hover:shadow-float focus-visible:outline-2 focus-visible:outline-ring"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-sm">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
