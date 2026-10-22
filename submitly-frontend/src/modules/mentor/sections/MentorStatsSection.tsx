"use client";

import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";
import { BaseSkeleton } from "@/components/reusable-components/placeholder/skeletons/BaseSkeleton";
import type { SubmissionStats } from "@/types/submissions.type";
import { useSubmissionStats } from "../services/mentor.service.hooks";

type TStatCardProps = {
  label: string;
  value: number | undefined;
  icon: typeof FileText;
  iconClassName: string;
};

const STAT_CARDS = [
  {
    key: "total",
    label: "Total submissions",
    icon: FileText,
    iconClassName: "text-foreground",
  },
  {
    key: "pending",
    label: "Pending review",
    icon: Clock,
    iconClassName: "text-amber-400",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconClassName: "text-emerald-400",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconClassName: "text-red-400",
  },
] as const satisfies readonly {
  key: keyof SubmissionStats;
  label: string;
  icon: typeof FileText;
  iconClassName: string;
}[];

export default function MentorStatsSection() {
  const { data } = useSubmissionStats();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          icon={card.icon}
          iconClassName={card.iconClassName}
          value={data?.[card.key]}
        />
      ))}
    </div>
  );
}

function StatCard(props: TStatCardProps) {
  const { label, value, icon: Icon, iconClassName } = props;
  return (
    <div className="rounded-lg bg-card p-5 shadow-card">
      <Icon
        className={`size-5 ${iconClassName}`}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <ShowIf condition={value === undefined}>
        <BaseSkeleton className="mt-3 h-8 w-16" />
      </ShowIf>
      <ShowIf condition={value !== undefined}>
        <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
      </ShowIf>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
