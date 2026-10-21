"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingAction } from "./MarketingAction";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="mesh-gradient pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-80"
      />
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto flex max-w-[1400px] flex-col items-center px-4 pt-24 pb-28 text-center sm:px-6 sm:pt-32"
      >
        <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-link-bg-soft px-3 py-1.5 text-sm text-link">
          <span className="size-1.5 rounded-full bg-link" />
          Built for learners &amp; mentors
        </span>

        <h1 className="max-w-4xl text-4xl leading-[1.05] tracking-[-0.05em] sm:text-display-xl">
          Submit your work. Get real feedback.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Submitly connects students with mentors for structured project reviews.
          Submit once, track feedback, grow faster.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MarketingAction />
          <Button asChild size="pill" variant="outline">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          For students &amp; mentors · Free to start
        </p>
      </motion.div>
    </section>
  );
}
