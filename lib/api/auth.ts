import type { AuthResponse, LoginRequest } from "@/lib/types/auth";
import { api } from "@/lib/api/client";

export async function login(request: LoginRequest): Promise<AuthResponse> {
  return api<AuthResponse>("/Auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(request),
  });
}
