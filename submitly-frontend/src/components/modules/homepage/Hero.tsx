"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes";

export default function Hero() {
  return (
    <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 text-center">
      <div className="mx-auto max-w-4xl px-6">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Now open for students &amp; mentors
        </span>

        <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] font-semibold tracking-[-0.04em] leading-[1.04] mb-6">
          One platform.<br />
          <span className="text-muted-foreground/60">Real feedback.</span>
        </h1>

        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground max-w-lg mx-auto">
          Submit your projects, get structured mentor reviews, and grow your
          skills — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="xl">
            <Link href={routes.register}>
              Get started free
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href={routes.login}>Sign in</Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border pt-10">
          {[
            { value: "500+", label: "Students enrolled" },
            { value: "1,200+", label: "Reviews" },
            { value: "4.9★", label: "Avg mentor rating" },
            { value: "1,200+", label: "Reviews delivered" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
