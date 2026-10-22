"use client";

import {
  ArrowRight,
  ClipboardList,
  FileText,
  MessageSquare,
  PenSquare,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/auth.hook";
import { routes } from "@/routes";

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

const mentorQuickLinks = [
  {
    title: "Review dashboard",
    description: "Review and give feedback on student submissions.",
    href: routes.admin,
    icon: Shield,
  },
  {
    title: "All submissions",
    description: "Browse every submission across all students.",
    href: routes.admin,
    icon: FileText,
  },
];

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
        {isMentor && (
          <Button asChild variant="outline">
            <Link href={routes.admin}>
              <Shield aria-hidden="true" />
              Review dashboard
            </Link>
          </Button>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(isMentor ? mentorQuickLinks : studentQuickLinks).map(
          ({ title, description, href, icon: Icon }) => (
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
          ),
        )}
      </div>
    </>
  );
}
