import { ApiResponse } from "@/types/api-response";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

// Server (container) gọi qua tên service, Client (browser) gọi qua port map ra host
function resolveBaseUrl(): string {
  const isServer = typeof window === "undefined";
  return isServer
    ? (process.env.API_URL_INTERNAL ?? "http://backend:3000/api/v1")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1");
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${resolveBaseUrl()}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    const message = !body.success
      ? Array.isArray(body.message)
        ? body.message.join(", ")
        : body.message
      : "Đã có lỗi xảy ra";
    throw new ApiError(res.status, message);
  }

  return body.data;
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET", cache: "no-store" }),
  post: <T>(path: string, data?: unknown, opts?: RequestOptions) =>
    request<T>(path, {
      ...opts,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data?: unknown, opts?: RequestOptions) =>
    request<T>(path, {
      ...opts,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
