import { MarketingAction } from "./MarketingAction";

export default function PremiumCta() {
  return (
    <section id="cta" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-4 py-24 text-center sm:px-6">
        <h2 className="mt-3 text-3xl tracking-[-0.04em] sm:text-display-lg">
          Ready to level up?
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Join hundreds of students getting better every week.
        </p>
        <MarketingAction className="mt-10" />
      </div>
    </section>
  );
}
