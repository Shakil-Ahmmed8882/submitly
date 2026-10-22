import type { ReactNode } from "react";

type TPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function PageHeader(props: TPageHeaderProps) {
  const { eyebrow, title, description } = props;
  return (
    <header className="min-w-0">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="break-words text-display-lg tracking-[-0.04em]">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
