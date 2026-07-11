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

function resolveBaseUrl(): string {
  const isServer = typeof window === "undefined";
  return isServer
    ? (process.env.API_URL_INTERNAL ?? "http://backend:3001/api/v1")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1");
}

// Transform ngược — snake_case (từ backend) -> camelCase (dùng trong code TS)
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        acc[camelKey] = toCamelCase(value);
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return obj;
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

  const rawBody: ApiResponse<T> = await res.json();
  const body = toCamelCase(rawBody); // transform ngay khi nhận response, trước khi trả cho code gọi

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
