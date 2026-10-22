import type { ReactNode } from "react";

type TShowIfProps = {
  condition: boolean;
  children: ReactNode;
};

export function ShowIf(props: TShowIfProps) {
  const { condition, children } = props;
  if (!condition) return null;
  return <>{children}</>;
}
