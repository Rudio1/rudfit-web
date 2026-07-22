import { CompleteInviteForm } from "@/components/auth/complete-invite-form";

interface RegisterInvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function RegisterInvitePage({
  params,
}: RegisterInvitePageProps) {
  const { token } = await params;

  return <CompleteInviteForm token={token} />;
}
