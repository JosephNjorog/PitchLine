const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const TOKEN_KEY = 'pitchline:token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string) {
    super(code)
    this.status = status
    this.code = code
  }
}

let onUnauthorized: (() => void) | null = null

/** Registered once by AuthProvider so any 401 anywhere clears the session from one place. */
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = opts
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    onUnauthorized?.()
  }

  if (!res.ok) {
    let code = 'unknown_error'
    try {
      const data = (await res.json()) as { error?: string }
      code = data.error ?? code
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, code)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const apiGet = <T>(path: string, auth = true) => request<T>(path, { method: 'GET', auth })
export const apiPost = <T>(path: string, body?: unknown, auth = true) =>
  request<T>(path, { method: 'POST', body, auth })
export const apiPatch = <T>(path: string, body?: unknown, auth = true) =>
  request<T>(path, { method: 'PATCH', body, auth })
export const apiDelete = <T>(path: string, auth = true) => request<T>(path, { method: 'DELETE', auth })
