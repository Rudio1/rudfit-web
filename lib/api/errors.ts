import type { ApiErrorBody } from "@/lib/types/auth";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function parseApiErrorMessage(
  status: number,
  body: ApiErrorBody | null,
): string {
  if (body?.message?.trim()) return body.message.trim();
  if (body?.title?.trim()) return body.title.trim();
  if (body?.detail?.trim()) return body.detail.trim();

  switch (status) {
    case 401:
      return "Sessão expirada. Faça login novamente.";
    case 403:
      return "Você não tem permissão para esta ação.";
    case 404:
      return "Recurso não encontrado.";
    case 408:
      return "Tempo esgotado. Tente novamente.";
    case 409:
      return "Conflito ao processar a solicitação.";
    case 0:
      return "Não foi possível conectar à API. Verifique sua conexão.";
    default:
      return `Erro inesperado (${status}).`;
  }
}
