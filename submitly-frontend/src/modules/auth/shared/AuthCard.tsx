import type { ReactNode } from "react";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";

type TAuthCardProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard(props: TAuthCardProps) {
  const { title, description, children, footer } = props;
  return (
    <div className="w-full max-w-sm">
      <section className="rounded-lg bg-card p-6 shadow-float sm:p-8">
        <div className="mb-8 space-y-2" aria-live="polite">
          <h1 className="text-display-md tracking-[-0.04em]">{title}</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </section>
      <ShowIf condition={!!footer}>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </ShowIf>
    </div>
  );
}
