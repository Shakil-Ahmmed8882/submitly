import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TSubmissionStatus } from "@/types/submissions.type";

type TSubmissionStatusBadgeProps = {
  status: TSubmissionStatus;
};

const STATUS_BADGE = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-400 ring-red-500/20",
    icon: XCircle,
  },
} as const;

export function SubmissionStatusBadge(props: TSubmissionStatusBadgeProps) {
  const { status } = props;
  const { label, className, icon: Icon } = STATUS_BADGE[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}
