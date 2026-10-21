import { MessageSquare, RotateCcw, ShieldCheck, Upload } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Submit your project",
    body: "Share your GitHub repo, live demo, and description in one form.",
  },
  {
    icon: MessageSquare,
    title: "Get structured feedback",
    body: "Mentors leave detailed, actionable comments on your work.",
  },
  {
    icon: RotateCcw,
    title: "Track revision history",
    body: "Every submission and feedback round is logged and searchable.",
  },
  {
    icon: ShieldCheck,
    title: "Safe and private",
    body: "Your submissions are only visible to you and your assigned mentor.",
  },
] as const;

export default function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
        <p className="eyebrow">Features</p>
        <h2 className="mt-3 max-w-2xl text-3xl tracking-[-0.04em] sm:text-display-lg">
          Everything your learning needs.
        </h2>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-md bg-card p-6 shadow-card transition-shadow hover:shadow-float"
            >
              <Icon className="size-5 text-muted-foreground" />
              <h3 className="mt-5 text-display-sm tracking-[-0.03em]">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
