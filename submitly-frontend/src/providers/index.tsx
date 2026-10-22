"use client";

import type { CSSProperties, ReactNode } from "react";
import { Toaster } from "sonner";
import QueryProvider from "./query.provider";
import SessionProvider from "./session.provider";

type TProvidersProps = {
  children: ReactNode;
};

const toasterStyle = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
} as CSSProperties;

export default function Providers(props: TProvidersProps) {
  const { children } = props;
  return (
    <QueryProvider>
      <SessionProvider />
      {children}
      <Toaster theme="dark" position="top-right" style={toasterStyle} />
    </QueryProvider>
  );
}
