import type { PerfumeListing } from '@shared/types/perfume'
import Breadcrumbs from './Breadcrumbs'
import FilterRail from './FilterRail'
import Pagination from './Pagination'
import ProductCard from './ProductCard'
import SortSelect from './SortSelect'
import Expandable from './Expandable'
import type { Crumb } from '@/lib/seo'

/**
 * The catalog page of the design: breadcrumbs, title with count and sort,
 * the filter rail beside the grid, pagination, and the "About …" text with
 * its Expand control. Used by the catalog, category, brand, note and
 * perfumer pages — only the scope and the texts differ.
 */
export default function Listing({
  basePath,
  crumbs,
  title,
  listing,
  intro,
  aboutTitle,
  aboutHtml,
}: {
  basePath: string
  crumbs: Crumb[]
  title: string
  listing: PerfumeListing
  intro?: string | null
  aboutTitle?: string
  aboutHtml?: string | null
}): React.JSX.Element {
  const { products, meta, facets, filters } = listing

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={crumbs} />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">{title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-muted">
                {meta.total} {meta.total === 1 ? 'product' : 'products'}
              </span>
              <SortSelect basePath={basePath} filters={filters} />
            </div>
          </div>
          {intro && <p className="m-0 max-w-[720px] text-[17px] text-muted">{intro}</p>}
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <FilterRail basePath={basePath} filters={filters} facets={facets} />

          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-8">
            {products.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
                {products.map((card) => (
                  <ProductCard key={card.id} card={card} variant="catalog" />
                ))}
              </div>
            ) : (
              <p className="rounded border border-dashed border-line-soft p-10 text-center text-muted">Nothing matches these filters.</p>
            )}

            <Pagination basePath={basePath} filters={filters} meta={meta} />

            {aboutHtml && (
              <div className="flex flex-col gap-3 border-t border-line pt-8">
                <h2 className="m-0 font-display text-[30px] font-normal leading-[1.1]">{aboutTitle ?? `About ${title.toLowerCase()}`}</h2>
                <Expandable html={aboutHtml} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
