import type { Metadata } from 'next'
import Link from 'next/link'
import { getPerfumers } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = { title: 'Perfumers', alternates: { canonical: '/perfumers' } }

export default async function PerfumersPage(): Promise<React.JSX.Element> {
  const perfumers = await getPerfumers()

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Perfumers' }]} />
          <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">Perfumers</h1>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] border-l border-t border-line">
          {perfumers.map((p) => (
            <Link key={p.id} href={`/perfumers/${p.slug}`} className="flex min-h-[88px] items-center justify-between gap-3 border-b border-r border-line px-6 font-display text-[24px]">
              {p.name}
              {typeof p.products_count === 'number' && <span className="font-sans text-[13px] text-muted">{p.products_count}</span>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
