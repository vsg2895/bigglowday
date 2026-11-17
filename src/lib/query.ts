import type { PerfumeFilters } from '@shared/types/perfume'

/** The filters as a query string, with overrides (a new page, a new sort…). Shared by server links and client pushes. */
export function filtersToQuery(filters: PerfumeFilters, overrides: Partial<Record<string, string | number | boolean | null>> = {}): string {
  const qs = new URLSearchParams()
  const put = (key: string, value: string | number | boolean | null | undefined): void => {
    if (value === undefined || value === null || value === '' || value === false) return
    qs.set(key, value === true ? '1' : String(value))
  }
  put('q', filters.q)
  put('in_stock', filters.in_stock)
  put('on_sale', filters.on_sale)
  put('sample', filters.sample)
  put('price_min', filters.price_min)
  put('price_max', filters.price_max)
  put('brand', filters.brand.join(','))
  put('type', filters.type.join(','))
  put('volume', filters.volume.join(','))
  put('family', filters.family.join(','))
  put('country', filters.country.join(','))
  put('sort', filters.sort === 'popular' ? '' : filters.sort)
  put('page', filters.page > 1 ? filters.page : '')
  for (const [k, v] of Object.entries(overrides)) {
    qs.delete(k)
    put(k, v)
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}
