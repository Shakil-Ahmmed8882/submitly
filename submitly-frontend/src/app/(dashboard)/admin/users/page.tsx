import { Users } from "lucide-react";

export const metadata = { title: "Users · Submitly" };

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
      <Users className="mb-4 size-8 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm font-medium">User management</p>
      <p className="mt-1 text-sm text-muted-foreground">Coming soon.</p>
    </div>
  );
}
