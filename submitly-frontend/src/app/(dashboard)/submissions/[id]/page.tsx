import { SubmissionDetail } from "@/components/modules/submissions/SubmissionDetail";

export const metadata = { title: "Submission detail" };

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubmissionDetail id={id} />;
}
