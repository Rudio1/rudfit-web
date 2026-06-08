import { getApiBaseUrl } from "@/lib/config";
import { getAccessToken } from "@/lib/auth/session";
import { ApiError, parseApiErrorMessage } from "@/lib/api/errors";
import type { ApiErrorBody } from "@/lib/types/auth";

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { auth = true, headers, body, ...rest } = options;
  const token = auth ? getAccessToken() : null;

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      body,
      headers: {
        Accept: "application/json",
        ...(body instanceof FormData
          ? {}
          : body
            ? { "Content-Type": "application/json; charset=utf-8" }
            : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      0,
      "Não foi possível conectar à API. Verifique sua conexão ou tente novamente.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let json: ApiErrorBody | T | null = null;
  const text = await response.text();

  if (text) {
    try {
      json = JSON.parse(text) as ApiErrorBody | T;
    } catch {
      if (!response.ok) {
        throw new ApiError(response.status, text);
      }
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      parseApiErrorMessage(response.status, json as ApiErrorBody | null),
    );
  }

  return json as T;
}

export async function apiForm<T>(
  path: string,
  formData: FormData,
  options: Omit<ApiRequestOptions, "body"> = {},
): Promise<T> {
  return api<T>(path, {
    ...options,
    method: "POST",
    body: formData,
  });
}
