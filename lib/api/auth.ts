import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/lib/types/auth";
import { api } from "@/lib/api/client";

export async function login(request: LoginRequest): Promise<AuthResponse> {
  console.log("login", request);
  return api<AuthResponse>("/Auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(request),
  });
}

export async function register(
  request: RegisterRequest,
): Promise<AuthResponse> {
  console.log("register", request);
  return api<AuthResponse>("/Auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(request),
  });
}
