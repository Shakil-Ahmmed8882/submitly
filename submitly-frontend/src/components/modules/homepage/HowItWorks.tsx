const steps = [
  {
    n: "01",
    title: "Sign up",
    body: "Create a free account as a student or mentor in under a minute.",
  },
  {
    n: "02",
    title: "Submit",
    body: "Fill out the submission form with your repo, live URL, and notes.",
  },
  {
    n: "03",
    title: "Review",
    body: "Your mentor reviews the work and leaves structured, actionable feedback.",
  },
  {
    n: "04",
    title: "Grow",
    body: "Apply the feedback, resubmit, and track your improvement over time.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-t border-border bg-canvas-soft"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 max-w-2xl text-3xl tracking-[-0.04em] sm:text-display-lg">
          Four steps. No confusion.
        </h2>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-lg bg-background p-8 shadow-float">
              <span className="font-mono text-xs text-muted-foreground">
                {s.n}
              </span>
              <h3 className="mt-6 text-display-md tracking-[-0.04em]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
