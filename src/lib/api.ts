/**
 * Every read the storefront makes, in Server Components only: the key is
 * server-side env and never reaches the browser. Each fetch is ISR-cached for
 * an hour and tagged `perfume` (plus a finer tag), which the backend's
 * RevalidatePerfumeSite job invalidates through /api/revalidate.
 */
import type {
  PerfumeBrand,
  PerfumeCategory,
  PerfumeHome,
  PerfumeListing,
  PerfumeNav,
  PerfumePage,
  PerfumePerfumer,
  PerfumeProduct,
  PerfumeProductCard,
  PerfumeScentNote,
  PerfumeSettings,
  PerfumeSitemap,
} from '@shared/types/perfume'

const API = process.env.PERFUME_API_URL
const KEY = process.env.PERFUME_API_KEY

if (!KEY) throw new Error('PERFUME_API_KEY is required (server-side env)')
if (!API) throw new Error('PERFUME_API_URL is required')

class ApiNotFound extends Error {}

async function perfumeFetch<T>(path: string, tags: string[] = []): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'X-Perfume-Key': KEY as string, Accept: 'application/json' },
    next: { revalidate: 3600, tags: ['perfume', ...tags] },
  })
  if (res.status === 404) throw new ApiNotFound(path)
  if (!res.ok) throw new Error(`Perfume API ${path} failed: ${res.status}`)
  const body = (await res.json()) as { data: T }
  return body.data
}

/** A slug lookup: null when the API says 404, so the page can `notFound()`. */
async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise
  } catch (e) {
    if (e instanceof ApiNotFound) return null
    throw e
  }
}

export type SearchParams = Record<string, string | string[] | undefined>

/** The filter keys a listing page forwards to the API, in a stable order. */
const LISTING_KEYS = ['in_stock', 'on_sale', 'sample', 'price_min', 'price_max', 'brand', 'type', 'volume', 'family', 'country', 'q', 'sort', 'page'] as const

export function listingQuery(params: SearchParams): string {
  const qs = new URLSearchParams()
  for (const key of LISTING_KEYS) {
    const v = params[key]
    const value = Array.isArray(v) ? v.join(',') : v
    if (value !== undefined && value !== '') qs.set(key, value)
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

export const getSettings = (): Promise<PerfumeSettings> => perfumeFetch('/settings', ['settings'])
export const getNav = (): Promise<PerfumeNav> => perfumeFetch('/nav', ['nav'])
export const getHome = (): Promise<PerfumeHome> => perfumeFetch('/home', ['home'])
export const getCategories = (): Promise<PerfumeCategory[]> => perfumeFetch('/categories', ['categories'])

export const getCatalog = (params: SearchParams): Promise<PerfumeListing> =>
  perfumeFetch(`/products${listingQuery(params)}`, ['products'])

export const getCategory = (slug: string, params: SearchParams): Promise<({ category: PerfumeCategory } & PerfumeListing) | null> =>
  orNull(perfumeFetch(`/categories/${slug}${listingQuery(params)}`, [`category:${slug}`]))

export const getProduct = (slug: string): Promise<{ product: PerfumeProduct; related: PerfumeProductCard[] } | null> =>
  orNull(perfumeFetch(`/products/${slug}`, [`product:${slug}`]))

export const getBrands = (): Promise<PerfumeBrand[]> => perfumeFetch('/brands', ['brands'])
export const getBrand = (slug: string, params: SearchParams): Promise<({ brand: PerfumeBrand } & PerfumeListing) | null> =>
  orNull(perfumeFetch(`/brands/${slug}${listingQuery(params)}`, [`brand:${slug}`]))

export const getNotes = (): Promise<PerfumeScentNote[]> => perfumeFetch('/notes', ['notes'])
export const getNote = (slug: string, params: SearchParams): Promise<({ note: PerfumeScentNote } & PerfumeListing) | null> =>
  orNull(perfumeFetch(`/notes/${slug}${listingQuery(params)}`, [`note:${slug}`]))

export const getPerfumers = (): Promise<PerfumePerfumer[]> => perfumeFetch('/perfumers', ['perfumers'])
export const getPerfumer = (slug: string, params: SearchParams): Promise<({ perfumer: PerfumePerfumer } & PerfumeListing) | null> =>
  orNull(perfumeFetch(`/perfumers/${slug}${listingQuery(params)}`, [`perfumer:${slug}`]))

export const getPages = (): Promise<PerfumePage[]> => perfumeFetch('/pages', ['pages'])
export const getPage = (slug: string): Promise<PerfumePage | null> => orNull(perfumeFetch(`/pages/${slug}`, [`page:${slug}`]))

export const getSitemap = (): Promise<PerfumeSitemap> => perfumeFetch('/sitemap', ['sitemap'])

/**
 * A write, for the route handlers under app/api/.
 *
 * The browser can never call the perfume API itself — the key is server-only
 * — so a form posts to our own route handler and that handler calls this.
 * The upstream status and validation errors are passed straight back, so the
 * form can show what the backend actually said rather than a generic failure.
 */
export async function perfumePost(
  path: string,
  body: unknown,
): Promise<{ status: number; body: { data?: unknown; message?: string; errors?: Record<string, string[]> } }> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'X-Perfume-Key': KEY as string,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  let parsed: { data?: unknown; message?: string; errors?: Record<string, string[]> } = {}
  try {
    parsed = (await res.json()) as typeof parsed
  } catch {
    parsed = {}
  }

  return { status: res.status, body: parsed }
}
