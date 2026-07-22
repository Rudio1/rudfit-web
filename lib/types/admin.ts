export interface InviteUserRequest {
  email: string;
}

export interface InviteUserResponse {
  email: string;
  expiresAtUtc: string;
}

export interface InvitePreview {
  email: string;
  isValid: boolean;
  message?: string | null;
  expiresAtUtc?: string | null;
}

export interface CompleteInviteRegistrationRequest {
  fullName: string;
  password: string;
}
