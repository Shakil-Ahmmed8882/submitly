import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Submitly — submit projects, get mentor feedback",
    template: "%s · Submitly",
  },
  description:
    "Submit your projects, track mentor reviews, and get actionable feedback to level up your skills.",
  openGraph: {
    type: "website",
    siteName: "Submitly",
    title: "Submitly — submit projects, get mentor feedback",
    description:
      "Submit your projects, track mentor reviews, and get actionable feedback to level up your skills.",
  },
  twitter: {
    card: "summary",
    title: "Submitly — submit projects, get mentor feedback",
    description:
      "Submit your projects, track mentor reviews, and get actionable feedback to level up your skills.",
  },
};

export default function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
