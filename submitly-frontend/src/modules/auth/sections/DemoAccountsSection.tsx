"use client";

import { useFormContext } from "react-hook-form";
import type { LoginInput } from "@/types/auth.type";

type TDemoAccount = LoginInput & {
  name: string;
  role: string;
};

type TDemoCardProps = {
  account: TDemoAccount;
  onSelect: (account: TDemoAccount) => void;
};

const DEMO_MENTOR: TDemoAccount = {
  name: "Admin Mentor",
  role: "Mentor",
  email: "mentor@submitly.com",
  password: "mentor123",
};

const DEMO_STUDENTS: TDemoAccount[] = [
  {
    name: "Robin",
    role: "Student",
    email: "robin@submitly.com",
    password: "student123",
  },
  {
    name: "Maliha",
    role: "Student",
    email: "maliha@submitly.com",
    password: "student123",
  },
];

// Fills the login form only; the user still presses "Log in".
export default function DemoAccountsSection() {
  const form = useFormContext<LoginInput>();

  function select(account: TDemoAccount) {
    const options = { shouldValidate: true, shouldDirty: true };
    form.setValue("email", account.email, options);
    form.setValue("password", account.password, options);
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-muted-foreground">Demo accounts</p>
      <DemoCard account={DEMO_MENTOR} onSelect={select} />
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or a student</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {DEMO_STUDENTS.map((account) => (
          <DemoCard key={account.email} account={account} onSelect={select} />
        ))}
      </div>
    </div>
  );
}

function DemoCard(props: TDemoCardProps) {
  const { account, onSelect } = props;
  return (
    <button
      type="button"
      onClick={() => onSelect(account)}
      className="flex w-full flex-col gap-0.5 rounded-md border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span className="text-xs text-muted-foreground">{account.role}</span>
      <span className="text-sm font-medium">{account.name}</span>
      <span className="truncate text-xs text-muted-foreground">
        {account.email}
      </span>
    </button>
  );
}
