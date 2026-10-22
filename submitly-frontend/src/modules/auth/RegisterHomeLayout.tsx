import Link from "next/link";
import { routes } from "@/routes/app.routes";
import RegisterFormSection from "./sections/RegisterFormSection";
import AuthCard from "./shared/AuthCard";

export default function RegisterHomeLayout() {
  return (
    <AuthCard
      title="Create your account"
      description="Join Submitly and start submitting your projects."
      footer={<RegisterFooter />}
    >
      <RegisterFormSection />
    </AuthCard>
  );
}

function RegisterFooter() {
  return (
    <>
      Already have an account?{" "}
      <Link href={routes.login} className="text-foreground hover:underline">
        Log in
      </Link>
    </>
  );
}
