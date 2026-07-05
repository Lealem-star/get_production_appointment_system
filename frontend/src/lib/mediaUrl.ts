export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? ''
}

export function resolveMediaUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const baseUrl = getApiBaseUrl()
  if (!baseUrl) return trimmed

  return `${baseUrl}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
}
