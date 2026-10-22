import Link from "next/link";
import { Suspense } from "react";
import { routes } from "@/routes/app.routes";
import LoginFormSection from "./sections/LoginFormSection";
import AuthCard from "./shared/AuthCard";
import AuthLoading from "./shared/AuthLoading";

export default function LoginHomeLayout() {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in to continue your learning journey."
      footer={<LoginFooter />}
    >
      <Suspense fallback={<AuthLoading />}>
        <LoginFormSection />
      </Suspense>
    </AuthCard>
  );
}

function LoginFooter() {
  return (
    <>
      New to Submitly?{" "}
      <Link href={routes.register} className="text-foreground hover:underline">
        Create an account
      </Link>
    </>
  );
}
