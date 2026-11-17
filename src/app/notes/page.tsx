import type { Metadata } from 'next'
import Link from 'next/link'
import { getNotes } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = { title: 'Scent notes', alternates: { canonical: '/notes' } }

export default async function NotesPage(): Promise<React.JSX.Element> {
  const notes = await getNotes()

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Scent notes' }]} />
          <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">Scent notes</h1>
          <p className="m-0 max-w-[720px] text-[17px] text-muted">Pick a note and see every fragrance that carries it in its top, heart or base.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {notes.map((n) => (
            <Link key={n.id} href={`/notes/${n.slug}`} className="inline-flex h-[52px] items-center gap-3 rounded-full border border-line px-7 text-[17px]">
              {n.name}
              {typeof n.products_count === 'number' && n.products_count > 0 && <span className="text-[13px] text-muted">{n.products_count}</span>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
