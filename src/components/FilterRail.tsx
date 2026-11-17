'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PerfumeFacetOption, PerfumeFacets, PerfumeFilters } from '@shared/types/perfume'
import { filtersToQuery } from '@/lib/query'

const CHECK = 'flex min-h-7 items-center gap-3'
const LEGEND = 'p-0 text-[12px] uppercase tracking-[0.12em] text-muted'
const NUM = 'box-border h-11 min-w-0 flex-1 rounded border border-line bg-bg px-3 text-ink placeholder:text-muted'

/**
 * The design's filter rail. Choices are held locally until "Show", which
 * pushes them into the URL (every filter is a query parameter, so a filtered
 * listing can be linked); "Reset all" returns to the bare listing. Facet
 * groups with no options are not drawn.
 *
 * Below 928px (58rem — a rem breakpoint, since a px one sorts before `sm:`
 * in Tailwind 4) the rail and the grid no longer fit side by side and the
 * grid wraps under it. Stacked, the rail takes the full width and its
 * groups flow into columns, instead of a 320px box alone at the left.
 */
export default function FilterRail({ basePath, filters, facets }: { basePath: string; filters: PerfumeFilters; facets: PerfumeFacets }): React.JSX.Element {
  const router = useRouter()
  const [f, setF] = useState<PerfumeFilters>(filters)

  const toggleIn = (key: 'brand' | 'type' | 'family' | 'country', value: string): void =>
    setF((s) => ({ ...s, [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value] }))
  const toggleVolume = (value: number): void =>
    setF((s) => ({ ...s, volume: s.volume.includes(value) ? s.volume.filter((v) => v !== value) : [...s.volume, value] }))

  const groups: { title: string; options: PerfumeFacetOption[]; checked: (v: string) => boolean; toggle: (v: string) => void }[] = [
    { title: 'Brand', options: facets.brands, checked: (v: string) => f.brand.includes(v), toggle: (v: string) => toggleIn('brand', v) },
    { title: 'Type', options: facets.types, checked: (v: string) => f.type.includes(v), toggle: (v: string) => toggleIn('type', v) },
    { title: 'Volume, ml', options: facets.volumes, checked: (v: string) => f.volume.includes(Number(v)), toggle: (v: string) => toggleVolume(Number(v)) },
    { title: 'Scent family', options: facets.families, checked: (v: string) => f.family.includes(v), toggle: (v: string) => toggleIn('family', v) },
    { title: 'Country', options: facets.countries, checked: (v: string) => f.country.includes(v), toggle: (v: string) => toggleIn('country', v) },
  ].filter((g) => g.options.length > 0)

  return (
    <aside
      aria-label="Filters"
      className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8 rounded border border-line bg-surface px-6 pb-6 pt-2 min-[58rem]:flex min-[58rem]:w-auto min-[58rem]:max-w-[320px] min-[58rem]:flex-[1_1_260px] min-[58rem]:flex-col"
    >
      <div className="flex flex-col gap-3.5 border-b border-line py-5">
        <label className={CHECK}>
          <input type="checkbox" checked={f.in_stock} onChange={(e) => setF({ ...f, in_stock: e.target.checked })} />
          In stock only
        </label>
        <label className={CHECK}>
          <input type="checkbox" checked={f.on_sale} onChange={(e) => setF({ ...f, on_sale: e.target.checked })} />
          On sale
        </label>
        <label className={CHECK}>
          <input type="checkbox" checked={f.sample} onChange={(e) => setF({ ...f, sample: e.target.checked })} />
          Sample available
        </label>
      </div>

      <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 border-b border-line p-0 py-5">
        <legend className={LEGEND}>Price, $</legend>
        <div className="flex gap-2.5">
          <input
            type="number"
            aria-label="Price from"
            placeholder={facets.price.min !== null ? `From ${facets.price.min}` : 'From'}
            value={f.price_min ?? ''}
            onChange={(e) => setF({ ...f, price_min: e.target.value === '' ? null : Number(e.target.value) })}
            className={NUM}
          />
          <input
            type="number"
            aria-label="Price to"
            placeholder={facets.price.max !== null ? `To ${facets.price.max}` : 'To'}
            value={f.price_max ?? ''}
            onChange={(e) => setF({ ...f, price_max: e.target.value === '' ? null : Number(e.target.value) })}
            className={NUM}
          />
        </div>
      </fieldset>

      {groups.map((g) => (
        <fieldset key={g.title} className="m-0 flex min-w-0 flex-col gap-2.5 border-0 border-b border-line p-0 py-5">
          <legend className={LEGEND}>{g.title}</legend>
          {g.options.map((o) => (
            <label key={o.value} className={CHECK}>
              <input type="checkbox" checked={g.checked(o.value)} onChange={() => g.toggle(o.value)} />
              {o.label}
            </label>
          ))}
        </fieldset>
      ))}

      <div className="col-span-full flex gap-2.5 pt-5 min-[58rem]:col-auto">
        <button type="button" onClick={() => router.push(basePath + filtersToQuery(f, { page: null }))} className="h-12 flex-1 rounded-full bg-accent font-semibold text-bg min-[58rem]:max-w-none">
          Show
        </button>
        <button type="button" onClick={() => router.push(basePath + (filters.q ? `?q=${encodeURIComponent(filters.q)}` : ''))} className="h-12 flex-1 rounded-full border border-line bg-transparent text-ink">
          Reset all
        </button>
      </div>
    </aside>
  )
}
