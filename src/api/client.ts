// Thin fetch wrapper. Centralizing this means swapping the mock backend
// (Mirage) for a real API later only requires changing API_BASE_URL / auth
// headers here, not every call site.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | undefined | null>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.pathname + url.search;
}

export async function apiRequest<TResponse>(
  path: string,
  { method = "GET", body, query }: RequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // response had no JSON body; fall back to the generic message
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as TResponse;
}
