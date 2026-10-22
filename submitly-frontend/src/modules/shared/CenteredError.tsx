import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { ShowIf } from "@/components/reusable-components/guard/ShowIf";

type TCenteredErrorProps = {
  title?: string;
  message: ReactNode;
  /** Actions, usually a retry button. */
  children?: ReactNode;
  /** For places that render without the app shell (route error boundaries). */
  fullPage?: boolean;
};

export function CenteredError(props: TCenteredErrorProps) {
  const {
    title = "Something went wrong",
    message,
    children,
    fullPage = false,
  } = props;
  const Heading = fullPage ? "h1" : "h2";
  const minHeight = fullPage ? "min-h-dvh" : "min-h-[50vh]";
  return (
    <div
      className={`flex w-full items-center justify-center px-4 py-10 ${minHeight}`}
    >
      <section
        role="alert"
        className="flex w-full max-w-md flex-col items-center gap-5 rounded-lg border border-border bg-card p-8 text-center shadow-card"
      >
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <Heading className="text-xl font-semibold tracking-[-0.04em]">
            {title}
          </Heading>
          <p className="text-sm leading-6 text-muted-foreground">{message}</p>
        </div>
        <ShowIf condition={!!children}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        </ShowIf>
      </section>
    </div>
  );
}
