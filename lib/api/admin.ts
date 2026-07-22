import { api } from "@/lib/api/client";
import type {
  InvitePreview,
  InviteUserRequest,
  InviteUserResponse,
  CompleteInviteRegistrationRequest,
} from "@/lib/types/admin";
import type { AuthResponse } from "@/lib/types/auth";

export async function inviteUser(
  request: InviteUserRequest,
): Promise<InviteUserResponse> {
  return api<InviteUserResponse>("/admin/users/invite", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getInvitePreview(token: string): Promise<InvitePreview> {
  return api<InvitePreview>(`/registration/invites/${encodeURIComponent(token)}`, {
    auth: false,
  });
}

export async function completeInviteRegistration(
  token: string,
  request: CompleteInviteRegistrationRequest,
): Promise<AuthResponse> {
  return api<AuthResponse>(
    `/registration/invites/${encodeURIComponent(token)}/complete`,
    {
      method: "POST",
      auth: false,
      body: JSON.stringify(request),
    },
  );
}
