import Link from 'next/link'
import type { PerfumeFilters, PerfumeListing } from '@shared/types/perfume'
import { filtersToQuery } from '@/lib/query'

const PILL = 'flex h-11 items-center justify-center rounded-full'

export default function Pagination({ basePath, filters, meta }: { basePath: string; filters: PerfumeFilters; meta: PerfumeListing['meta'] }): React.JSX.Element | null {
  if (meta.last_page <= 1) return null
  const href = (page: number): string => basePath + filtersToQuery(filters, { page: page > 1 ? page : null })
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1).filter((p) => p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 2)

  return (
    <nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2">
      {meta.current_page > 1 && (
        <Link href={href(meta.current_page - 1)} className={`${PILL} border border-line px-5`}>
          ← Previous
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="contents">
          {i > 0 && pages[i - 1] !== p - 1 && <span className={`${PILL} w-11 text-muted`}>…</span>}
          <Link href={href(p)} aria-current={p === meta.current_page ? 'page' : undefined} className={`${PILL} w-11 ${p === meta.current_page ? 'bg-ink font-semibold text-bg' : 'border border-line'}`}>
            {p}
          </Link>
        </span>
      ))}
      {meta.current_page < meta.last_page && (
        <Link href={href(meta.current_page + 1)} className={`${PILL} border border-line px-5`}>
          Next →
        </Link>
      )}
    </nav>
  )
}
