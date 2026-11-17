'use client'

import { useState } from 'react'
import type { PerfumeGender, PerfumeProductCard } from '@shared/types/perfume'
import ProductCard from './ProductCard'

const TABS: { label: string; value: PerfumeGender | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Unisex', value: 'unisex' },
]

/** The home grid of products flagged "new", with the design's gender tabs. */
export default function NewArrivals({ title, products }: { title: string; products: PerfumeProductCard[] }): React.JSX.Element {
  const [tab, setTab] = useState<PerfumeGender | 'all'>('all')
  const shown = products.filter((p) => tab === 'all' || p.gender === tab)

  return (
    <section id="new" className="px-[clamp(20px,4vw,56px)] pb-[88px]">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="m-0 font-display text-[40px] font-normal leading-[1.1]">{title}</h2>
          <div role="group" aria-label={`Filter ${title.toLowerCase()}`} className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={tab === t.value}
                onClick={() => setTab(t.value)}
                className={`h-11 rounded-full border border-line px-5 font-medium ${tab === t.value ? 'bg-ink text-bg' : 'bg-transparent text-ink'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {shown.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
            {shown.map((card) => (
              <ProductCard key={card.id} card={card} variant="home" />
            ))}
          </div>
        ) : (
          <p className="text-muted">No new arrivals in this section yet.</p>
        )}
      </div>
    </section>
  )
}
