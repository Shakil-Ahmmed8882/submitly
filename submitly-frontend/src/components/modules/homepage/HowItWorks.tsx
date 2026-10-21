import { FileText, MessageSquare, RefreshCw, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Submit your project",
    desc: "Add URL, live demo, description, and notes — all in one smart form.",
  },
  {
    icon: MessageSquare,
    title: "Structured feedback",
    desc: "Mentors leave detailed, prioritized comments — not vague suggestions.",
  },
  {
    icon: RefreshCw,
    title: "Track revisions",
    desc: "Every submission and feedback round is tagged and searchable.",
  },
  {
    icon: Lock,
    title: "Private by default",
    desc: "Only you and your assigned mentor can see your submissions.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-3">Features</p>
            <h2 className="text-display-sm tracking-[-0.03em]">Built different.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs sm:text-right">
            Not just a form. A complete feedback loop designed for real growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border/80 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-sm font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
