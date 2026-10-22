"use client";

import Link from "next/link";
import { BaseSkeleton } from "@/components/reusable-components/placeholder/skeletons/BaseSkeleton";
import { Button } from "@/components/ui/button";
import { PanelMessage } from "@/modules/shared/PanelMessage";
import { SubmissionStatusBadge } from "@/modules/shared/submissions/SubmissionStatusBadge";
import { formatDate } from "@/modules/shared/submissions/submission.utils";
import { routes } from "@/routes/app.routes";
import type { Submission } from "@/types/submissions.type";
import { useMySubmissions } from "../services/student.service.hooks";

type TSubmissionRowProps = {
  submission: Submission;
};

type TMentorCommentProps = {
  comment: string | null;
};

const SKELETON_ROWS = [0, 1, 2];

export default function MySubmissionsSection() {
  const { data, isPending, isError } = useMySubmissions();

  if (isPending) return <SubmissionsSkeleton />;
  if (isError) {
    return (
      <PanelMessage
        title="Failed to load submissions"
        message="Please try refreshing the page."
      />
    );
  }
  if (data.length === 0) return <NoSubmissions />;

  return (
    <ul className="divide-y divide-border rounded-lg bg-card shadow-card">
      {data.map((submission) => (
        <SubmissionRow key={submission.id} submission={submission} />
      ))}
    </ul>
  );
}

function SubmissionRow(props: TSubmissionRowProps) {
  const { submission } = props;
  const { project_name, status, created_at, review_comment } = submission;
  return (
    <li className="space-y-2 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="truncate text-sm font-medium">{project_name}</p>
        <div className="flex items-center gap-3">
          <SubmissionStatusBadge status={status} />
          <p className="text-xs text-muted-foreground">
            {formatDate(created_at)}
          </p>
        </div>
      </div>
      <MentorComment comment={review_comment} />
    </li>
  );
}

function MentorComment(props: TMentorCommentProps) {
  const { comment } = props;
  if (!comment) return null;
  return (
    <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Mentor feedback: </span>
      {comment}
    </p>
  );
}

function NoSubmissions() {
  return (
    <div className="space-y-4">
      <PanelMessage
        title="No submissions yet"
        message="You haven't submitted any projects yet."
      />
      <Button asChild>
        <Link href={routes.submit}>Submit your first project</Link>
      </Button>
    </div>
  );
}

function SubmissionsSkeleton() {
  return (
    <div className="divide-y divide-border rounded-lg bg-card shadow-card">
      {SKELETON_ROWS.map((row) => (
        <div key={row} className="flex items-center gap-4 px-5 py-4">
          <BaseSkeleton className="h-4 flex-1" />
          <BaseSkeleton className="h-5 w-16 rounded-full" />
          <BaseSkeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
