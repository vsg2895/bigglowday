/** One place decides the host: trailing slash stripped, used by every canonical and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3015').replace(/\/+$/, '')
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Big Glow Day'
export const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? 'bigglowday'
