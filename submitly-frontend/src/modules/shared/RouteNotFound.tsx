import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes/app.routes";

// `/` sends a signed-in user to the dashboard and everyone else to the login.
export default function RouteNotFound() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-16">
      <section className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <p className="eyebrow">404</p>
        <h1 className="text-display-lg">Page not found.</h1>
        <p className="text-sm text-muted-foreground">
          This page doesn't exist, or the link is no longer available.
        </p>
        <Button asChild className="mt-2">
          <Link href={routes.home}>Go back</Link>
        </Button>
      </section>
    </div>
  );
}
