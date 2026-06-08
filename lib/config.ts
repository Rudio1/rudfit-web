export function getApiBaseUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-proxy";

  return baseUrl.replace(/\/$/, "");
}
