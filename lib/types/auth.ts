export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  isFirstAccess: boolean;
  username?: string | null;
}

export interface AuthSession extends AuthResponse {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username?: string;
  password: string;
}

export interface ApiErrorBody {
  message?: string;
  title?: string;
  detail?: string;
}
