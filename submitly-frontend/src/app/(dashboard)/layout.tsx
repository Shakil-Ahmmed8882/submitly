import { Suspense } from "react";
import { AppShell } from "@/components/navigation/dashboard/AppShell";
import DashboardLoading from "@/modules/shared/DashboardLoading";

type TDashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout(props: TDashboardLayoutProps) {
  const { children } = props;
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
