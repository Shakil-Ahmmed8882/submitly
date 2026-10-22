import { cookies } from "next/headers";
import MentorDashboardHomeLayout from "@/modules/mentor/MentorDashboardHomeLayout";
import StudentDashboardHomeLayout from "@/modules/student/StudentDashboardHomeLayout";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const role = (await cookies()).get("role")?.value;
  if (role === "MENTOR") return <MentorDashboardHomeLayout />;
  return <StudentDashboardHomeLayout />;
}
