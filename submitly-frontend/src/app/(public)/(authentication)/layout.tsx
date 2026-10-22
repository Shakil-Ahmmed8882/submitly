import { Logo } from "@/components/brand/Logo";

type TAuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout(props: TAuthLayoutProps) {
  const { children } = props;
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-sm bg-primary p-3 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <main
        id="main"
        className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-8 px-4 py-12"
      >
        <Logo />
        {children}
      </main>
    </>
  );
}
