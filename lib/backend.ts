/** Server-side helper for calling the NestJS backend. BACKEND_URL is never sent to the browser. */
export function backendUrl(path: string) {
  const base = process.env.BACKEND_URL;
  if (!base) throw new Error("BACKEND_URL is not set");
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function backendFetch(path: string, init: RequestInit & { token?: string } = {}) {
  const { token, headers, ...rest } = init;
  return fetch(backendUrl(path), {
    cache: "no-store",
    ...rest,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
}
