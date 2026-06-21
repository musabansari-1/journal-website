/**
 * API_BASE — points to the deployed Worker.
 * Set via Cloudflare Pages env var: NEXT_PUBLIC_API_URL
 * Falls back to relative path for local dev (next dev + wrangler dev side by side).
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}
