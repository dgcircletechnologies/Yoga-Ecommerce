import { getToken } from "@/utils/auth";

const PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");
const SERVER_API_URL = (process.env.INTERNAL_API_URL ?? PUBLIC_API_URL).replace(/\/$/, "");

type ApiError = { message?: string | string[] };

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  // Server-rendered pages run inside the frontend container, where localhost
  // is not the backend container. Browser requests must keep using the public
  // host URL, while server requests can use the Docker-internal URL.
  const apiUrl = typeof window === "undefined" ? SERVER_API_URL : PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => null) as T & ApiError | null;
  if (!response.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
    throw new Error(message || "Something went wrong. Please try again.");
  }
  return body as T;
}
