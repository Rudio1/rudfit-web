import { InvitePreview } from "@/components/friends/invite-preview";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  return <InvitePreview token={token} />;
}
