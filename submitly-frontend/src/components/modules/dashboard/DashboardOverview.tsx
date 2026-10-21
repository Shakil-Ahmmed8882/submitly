"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  PenSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/auth.hook";
import { routes } from "@/routes";

const stats = [
  { label: "Total submissions", value: "12", icon: FileText },
  { label: "Pending review", value: "3", icon: Clock },
  { label: "Reviewed", value: "9", icon: CheckCircle2 },
  { label: "Feedback received", value: "7", icon: MessageSquare },
];

const recentSubmissions = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    category: "Full Stack",
    status: "Reviewed",
    date: "Oct 20, 2026",
  },
  {
    id: "2",
    title: "Task Manager App",
    category: "Frontend",
    status: "Pending",
    date: "Oct 18, 2026",
  },
  {
    id: "3",
    title: "REST API with Auth",
    category: "Backend",
    status: "Reviewed",
    date: "Oct 15, 2026",
  },
  {
    id: "4",
    title: "Chat Application",
    category: "Full Stack",
    status: "Pending",
    date: "Oct 12, 2026",
  },
  {
    id: "5",
    title: "Portfolio Website",
    category: "Frontend",
    status: "Reviewed",
    date: "Oct 10, 2026",
  },
];

const statusColors: Record<string, string> = {
  Reviewed:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  Pending:
    "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
};

const quickLinks = [
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
    icon: FileText,
  },
  {
    title: "Latest feedback",
    description: "Read what your mentor said about your last project.",
    href: routes.submissionDetail("1"),
    icon: MessageSquare,
  },
];

export default function DashboardOverview() {
  const session = useSession();
  if (!session.data) return null;
  const user = session.data;

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="eyebrow mb-3">Overview</p>
          <h1 className="break-words text-display-lg tracking-[-0.04em]">
            Welcome back, {user.name}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your projects and mentor feedback, all in one place.
          </p>
        </div>
        <Button asChild>
          <Link href={routes.create}>
            <PenSquare aria-hidden="true" />
            Submit project
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg bg-card p-5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground">
              <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
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

      <section className="rounded-lg bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-medium">Recent submissions</h2>
          <Link
            href={routes.submissions}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentSubmissions.map((sub) => (
            <Link
              key={sub.id}
              href={routes.submissionDetail(sub.id)}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-accent/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{sub.title}</p>
                <p className="text-xs text-muted-foreground">
                  {sub.category} · {sub.date}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[sub.status]}`}
              >
                {sub.status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
