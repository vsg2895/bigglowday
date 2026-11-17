'use client'

import { useRouter } from 'next/navigation'
import type { PerfumeFilters, PerfumeSort } from '@shared/types/perfume'
import { filtersToQuery } from '@/lib/query'

const OPTIONS: { value: PerfumeSort; label: string }[] = [
  { value: 'popular', label: 'Popular first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
]

export default function SortSelect({ basePath, filters }: { basePath: string; filters: PerfumeFilters }): React.JSX.Element {
  const router = useRouter()
  return (
    <label className="flex items-center gap-2.5 text-muted">
      Sort
      <select
        value={filters.sort}
        onChange={(e) => router.push(basePath + filtersToQuery(filters, { sort: e.target.value, page: null }))}
        className="h-11 rounded-full border border-line bg-surface px-3.5 text-ink"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
