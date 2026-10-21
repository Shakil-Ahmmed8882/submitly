"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Link2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes";

const MOCK_SUBMISSION = {
  id: "1",
  title: "E-commerce Dashboard",
  description:
    "A full-stack e-commerce dashboard built with Next.js, Prisma and PostgreSQL. Features include product management, order tracking, revenue charts, and customer analytics. I used Recharts for data visualization and Tailwind CSS for styling.",
  category: "Full Stack",
  githubUrl: "https://github.com/shakil/ecommerce-dashboard",
  liveUrl: "https://ecommerce-dashboard.vercel.app",
  status: "Reviewed",
  date: "Oct 20, 2026",
  mentor: "Sarah Johnson",
  notes:
    "I focused on making the charts interactive and responsive. Would love feedback on my data fetching approach and whether my Prisma queries are optimal.",
  attachments: ["screenshot-home.png", "screenshot-orders.png"],
  feedback: {
    summary:
      "Excellent work overall! The project shows a strong grasp of full-stack development. A few areas to improve for production readiness.",
    items: [
      { type: "positive" as const, text: "Clean component architecture with good separation of concerns." },
      { type: "positive" as const, text: "Prisma schema is well-structured and the relations are correct." },
      { type: "positive" as const, text: "Responsive design works well across breakpoints." },
      { type: "improvement" as const, text: "Add error boundaries around the chart components." },
      { type: "improvement" as const, text: "Consider adding optimistic updates for the order status toggle." },
      { type: "improvement" as const, text: "The N+1 query in the orders list should be replaced with a single join." },
    ],
    rating: 4,
    reviewedAt: "Oct 21, 2026",
  },
};

const statusConfig = {
  Reviewed: {
    icon: CheckCircle2,
    label: "Reviewed",
    className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  },
  Pending: {
    icon: Clock,
    label: "Pending review",
    className: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  },
};

const STARS = [1, 2, 3, 4, 5];

export function SubmissionDetail({ id }: { id: string }) {
  const sub = { ...MOCK_SUBMISSION, id };
  const statusCfg = statusConfig[sub.status as keyof typeof statusConfig];
  const StatusIcon = statusCfg.icon;

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
            <h1 className="text-display-lg tracking-[-0.04em]">{sub.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {sub.category} · Submitted {sub.date}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusCfg.className}`}
          >
            <StatusIcon className="size-4" aria-hidden="true" />
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="rounded-lg bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-medium">Description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{sub.description}</p>
          </section>

          <section className="rounded-lg bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-medium">Links</h2>
            <div className="space-y-2">
              <a
                href={sub.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Link2 className="size-4" aria-hidden="true" />
                GitHub repository
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
              {sub.liveUrl && (
                <a
                  href={sub.liveUrl}
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

          {sub.notes && (
            <section className="rounded-lg bg-card p-5 shadow-card">
              <h2 className="mb-3 text-sm font-medium">Notes for mentor</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{sub.notes}</p>
            </section>
          )}

          {sub.attachments.length > 0 && (
            <section className="rounded-lg bg-card p-5 shadow-card">
              <h2 className="mb-3 text-sm font-medium">Attachments</h2>
              <div className="space-y-2">
                {sub.attachments.map((name) => (
                  <div key={name} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="size-4" aria-hidden="true" />
                    {name}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          {sub.feedback ? (
            <section className="rounded-lg bg-card p-5 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-sm font-medium">Mentor feedback</h2>
              </div>
              <p className="mb-1 text-xs text-muted-foreground">
                {sub.mentor} · {sub.feedback.reviewedAt}
              </p>
              <div className="mb-4 flex gap-0.5">
                {STARS.map((n) => (
                  <span
                    key={n}
                    className={n <= sub.feedback.rating ? "text-amber-400" : "text-muted-foreground/30"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {sub.feedback.summary}
              </p>
              <ul className="space-y-2.5">
                {sub.feedback.items.map((item) => (
                  <li key={item.text} className="flex gap-2 text-sm">
                    <span
                      className={
                        item.type === "positive"
                          ? "mt-0.5 shrink-0 text-emerald-400"
                          : "mt-0.5 shrink-0 text-amber-400"
                      }
                    >
                      {item.type === "positive" ? "✓" : "→"}
                    </span>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="rounded-lg bg-card p-5 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-sm font-medium">Mentor feedback</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Your mentor hasn't reviewed this project yet. You'll be notified when feedback is ready.
              </p>
            </section>
          )}

          <Button asChild className="w-full" variant="outline">
            <Link href={routes.create}>Submit another project</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
