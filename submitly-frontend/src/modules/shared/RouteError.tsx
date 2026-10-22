"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes/app.routes";
import { CenteredError } from "./CenteredError";

type TRouteErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function RouteError(props: TRouteErrorProps) {
  const { retry } = props;
  return (
    <CenteredError
      fullPage
      message="We couldn't load this page. Try again, or return home."
    >
      <Button onClick={retry}>Try again</Button>
      <Button asChild variant="outline">
        <Link href={routes.home}>Home</Link>
      </Button>
    </CenteredError>
  );
}
