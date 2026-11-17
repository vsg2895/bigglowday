import type { Metadata } from 'next'
import Link from 'next/link'
import { getBrands } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = { title: 'Brands A–Z', alternates: { canonical: '/brands' } }

export default async function BrandsPage(): Promise<React.JSX.Element> {
  const brands = await getBrands()
  const groups = new Map<string, typeof brands>()
  for (const b of brands) {
    const letter = b.name.normalize('NFD').replace(/[̀-ͯ]/g, '')[0]?.toUpperCase() ?? '#'
    groups.set(letter, [...(groups.get(letter) ?? []), b])
  }

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Brands A–Z' }]} />
          <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">Brands A–Z</h1>
          <p className="m-0 text-muted">
            {brands.length} {brands.length === 1 ? 'house' : 'houses'}
          </p>
        </div>
        {[...groups.entries()].map(([letter, items]) => (
          <div key={letter} className="flex flex-wrap gap-8 border-t border-line pt-6">
            <div className="w-16 font-display text-[40px] leading-none text-accent">{letter}</div>
            <div className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-8 gap-y-3">
              {items.map((b) => (
                <Link key={b.id} href={`/brands/${b.slug}`} className="flex items-baseline justify-between gap-3 font-display text-[24px]">
                  {b.name}
                  {typeof b.products_count === 'number' && <span className="font-sans text-[13px] text-muted">{b.products_count}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
