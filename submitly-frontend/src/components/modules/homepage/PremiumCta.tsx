import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes";

const TESTIMONIALS = [
  {
    quote:
      "My code quality improved dramatically after just two reviews. The feedback was specific and immediately actionable.",
    name: "Shakil A.",
    role: "Full Stack Student",
    initials: "SA",
    color: "from-violet-500 to-blue-600",
  },
  {
    quote:
      "Finally a platform where mentors give real feedback, not just 'looks good'. I rewrote my entire data layer after one review.",
    name: "Maria R.",
    role: "Frontend Student",
    initials: "MR",
    color: "from-pink-500 to-rose-600",
  },
  {
    quote:
      "Submitly made me accountable. Knowing my mentor would actually read my code made me write better code from the start.",
    name: "James K.",
    role: "Backend Student",
    initials: "JK",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function PremiumCta() {
  return (
    <>
      {/* Testimonials */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <p className="eyebrow mb-3">Testimonials</p>
            <h2 className="text-display-sm tracking-[-0.03em]">Students say it best.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map(({ quote, name, role, initials, color }) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col"
              >
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full bg-linear-to-br ${color} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-[10px] font-semibold text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{name}</p>
                    <p className="text-[10px] text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-border bg-card p-10 sm:p-14 text-center">
            <h2 className="text-display-sm tracking-[-0.03em] mb-3">
              Ready to get better, faster?
            </h2>
            <p className="text-base text-muted-foreground max-w-sm mx-auto mb-8">
              Join 500+ students growing with real mentor feedback every week.
            </p>
            <Button asChild size="xl">
              <Link href={routes.register}>
                Create free account
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground/50">No credit card required</p>
          </div>
        </div>
      </section>
    </>
  );
}
