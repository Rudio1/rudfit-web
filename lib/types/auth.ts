export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  isFirstAccess: boolean;
  isAdmin: boolean;
  username?: string | null;
}

export interface AuthSession extends AuthResponse {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiErrorBody {
  message?: string;
  title?: string;
  detail?: string;
}
