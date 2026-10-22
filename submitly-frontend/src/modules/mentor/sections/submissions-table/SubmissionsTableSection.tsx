"use client";

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelMessage } from "@/modules/shared/PanelMessage";
import { SubmissionStatusBadge } from "@/modules/shared/submissions/SubmissionStatusBadge";
import { formatDate } from "@/modules/shared/submissions/submission.utils";
import type {
  Submission,
  TReviewStatus,
  TSubmissionStatus,
} from "@/types/submissions.type";
import { useAllSubmissions } from "../../services/mentor.service.hooks";
import ReviewModal, { type TReviewTarget } from "./ReviewModal";
import SubmissionsTableSkeleton from "./SubmissionsTableSkeleton";

type TStatusTabsProps = {
  active: TSubmissionStatus | undefined;
  onChange: (status: TSubmissionStatus | undefined) => void;
};

type TSubmissionsTableProps = {
  submissions: Submission[];
  onReview: (target: TReviewTarget) => void;
};

type TTableStateProps = TSubmissionsTableProps & {
  isPending: boolean;
  isError: boolean;
};

type TReviewButtonProps = TTableRowProps & {
  label: string;
  status: TReviewStatus;
};

type TTableRowProps = {
  submission: Submission;
  onReview: (target: TReviewTarget) => void;
};

type TExternalLinkProps = {
  href: string | null;
  label: string;
};

type TPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const STATUS_TABS: { value: TSubmissionStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const TABLE_HEADINGS = ["Student", "Project", "Links", "Status", "Date", ""];

export default function SubmissionsTableSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [review, setReview] = useState<TReviewTarget | null>(null);
  const status = parseStatus(searchParams.get("status"));
  const page = parsePage(searchParams.get("page"));
  const { data, isPending, isError } = useAllSubmissions(page, status);
  const submissions = data?.submissions ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Changing the filter always goes back to page 1.
  function changeStatus(next: TSubmissionStatus | undefined) {
    const params = new URLSearchParams();
    if (next) params.set("status", next.toLowerCase());
    router.replace(`?${params}`);
  }

  function changePage(next: number) {
    const params = new URLSearchParams(searchParams);
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    router.replace(`?${params}`);
  }

  return (
    <div className="space-y-4">
      <StatusTabs active={status} onChange={changeStatus} />
      <TableState
        isPending={isPending}
        isError={isError}
        submissions={submissions}
        onReview={setReview}
      />
      <ShowIf condition={totalPages > 1}>
        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
      </ShowIf>
      <ReviewModal review={review} onClose={() => setReview(null)} />
    </div>
  );
}

function TableState(props: TTableStateProps) {
  const { isPending, isError, submissions, onReview } = props;
  if (isError) {
    return (
      <PanelMessage
        title="Failed to load submissions"
        message="Please try refreshing the page."
      />
    );
  }
  if (isPending) return <SubmissionsTableSkeleton />;
  if (submissions.length === 0) {
    return (
      <PanelMessage
        title="No submissions found"
        message="Try a different filter."
      />
    );
  }
  return <SubmissionsTable submissions={submissions} onReview={onReview} />;
}

function StatusTabs(props: TStatusTabsProps) {
  const { active, onChange } = props;
  return (
    <nav
      aria-label="Submission status"
      className="flex gap-1 border-b border-border"
    >
      {STATUS_TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

function SubmissionsTable(props: TSubmissionsTableProps) {
  const { submissions, onReview } = props;
  return (
    <div className="overflow-x-auto rounded-lg bg-card shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-medium text-muted-foreground">
            {TABLE_HEADINGS.map((heading) => (
              <th key={heading} scope="col" className="px-5 py-3 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {submissions.map((submission) => (
            <TableRow
              key={submission.id}
              submission={submission}
              onReview={onReview}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow(props: TTableRowProps) {
  const { submission, onReview } = props;
  const { project_name, user, repo_url, live_link, status, created_at } =
    submission;
  const isPending = status === "PENDING";
  return (
    <tr>
      <td className="px-5 py-4 text-muted-foreground">{user?.name ?? "—"}</td>
      <td className="max-w-56 truncate px-5 py-4 font-medium">
        {project_name}
      </td>
      <td className="px-5 py-4">
        <div className="flex gap-3">
          <LinkOut href={repo_url} label="Repo" />
          <LinkOut href={live_link} label="Live" />
        </div>
      </td>
      <td className="px-5 py-4">
        <SubmissionStatusBadge status={status} />
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">
        {formatDate(created_at)}
      </td>
      <td className="px-5 py-4">
        <ShowIf condition={isPending}>
          <div className="flex justify-end gap-2">
            <ReviewButton
              label="Reject"
              status="REJECTED"
              submission={submission}
              onReview={onReview}
            />
            <ReviewButton
              label="Approve"
              status="APPROVED"
              submission={submission}
              onReview={onReview}
            />
          </div>
        </ShowIf>
      </td>
    </tr>
  );
}

function ReviewButton(props: TReviewButtonProps) {
  const { label, status, submission, onReview } = props;
  return (
    <Button
      size="sm"
      variant={status === "REJECTED" ? "outline" : "default"}
      onClick={() => onReview({ submission, status })}
    >
      {label}
    </Button>
  );
}

function LinkOut(props: TExternalLinkProps) {
  const { href, label } = props;
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
    >
      {label}
      <ExternalLink className="size-3" aria-hidden="true" />
    </a>
  );
}

function Pagination(props: TPaginationProps) {
  const { page, totalPages, onChange } = props;
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          aria-label="Previous page"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function parseStatus(value: string | null): TSubmissionStatus | undefined {
  const upper = value?.toUpperCase();
  if (upper === "PENDING" || upper === "APPROVED" || upper === "REJECTED") {
    return upper;
  }
  return undefined;
}

function parsePage(value: string | null) {
  const page = Number(value ?? "1");
  return Number.isInteger(page) && page > 0 ? page : 1;
}
