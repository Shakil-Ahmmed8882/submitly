"use client";

import { ArrowRight, FileText, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/routes";

const ALL_SUBMISSIONS = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    category: "Full Stack",
    status: "Reviewed",
    date: "Oct 20, 2026",
    mentor: "Sarah Johnson",
  },
  {
    id: "2",
    title: "Task Manager App",
    category: "Frontend",
    status: "Pending",
    date: "Oct 18, 2026",
    mentor: "Sarah Johnson",
  },
  {
    id: "3",
    title: "REST API with Auth",
    category: "Backend",
    status: "Reviewed",
    date: "Oct 15, 2026",
    mentor: "Sarah Johnson",
  },
  {
    id: "4",
    title: "Chat Application",
    category: "Full Stack",
    status: "Pending",
    date: "Oct 12, 2026",
    mentor: "Sarah Johnson",
  },
  {
    id: "5",
    title: "Portfolio Website",
    category: "Frontend",
    status: "Reviewed",
    date: "Oct 10, 2026",
    mentor: "Sarah Johnson",
  },
  {
    id: "6",
    title: "Mobile Weather App",
    category: "Mobile",
    status: "Reviewed",
    date: "Oct 5, 2026",
    mentor: "Sarah Johnson",
  },
];

const statusColors: Record<string, string> = {
  Reviewed:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  Pending:
    "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
};

const CATEGORIES = ["All", "Frontend", "Backend", "Full Stack", "Mobile"];
const STATUSES = ["All", "Pending", "Reviewed"];

export function SubmissionsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = ALL_SUBMISSIONS.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || s.category === category;
    const matchStatus = status === "All" || s.status === status;
    return matchSearch && matchCategory && matchStatus;
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <FileText
            className="mb-3 size-10 text-muted-foreground"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium">No submissions found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-card shadow-card">
          <div className="hidden grid-cols-[1fr_120px_110px_100px_40px] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Project</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>
          <div className="divide-y divide-border">
            {filtered.map((sub) => (
              <Link
                key={sub.id}
                href={routes.submissionDetail(sub.id)}
                className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-accent/40 sm:grid sm:grid-cols-[1fr_120px_110px_100px_40px] sm:items-center sm:gap-4"
              >
                <p className="truncate text-sm font-medium">{sub.title}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {sub.category}
                </p>
                <span
                  className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[sub.status]}`}
                >
                  {sub.status}
                </span>
                <p className="text-xs text-muted-foreground">{sub.date}</p>
                <ArrowRight
                  className="hidden size-4 text-muted-foreground sm:block"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
