'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavLink {
  label: string
  href: string
}

/**
 * The category strip under the header; the current section takes the accent
 * colour, as in the design. The links wrap as bare text there; each one here
 * carries 10px of padding cancelled by a negative margin, so the row looks
 * the same and a thumb has a 42px target.
 */
export default function CatalogNav({ links }: { links: NavLink[] }): React.JSX.Element {
  const pathname = usePathname()

  return (
    <nav aria-label="Catalog" className="border-y border-line px-[clamp(20px,4vw,56px)]">
      <div className="mx-auto flex min-h-14 max-w-[1320px] flex-wrap items-center gap-x-8 gap-y-1.5 font-medium">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href + '/'))
          return (
            <Link key={l.href + l.label} href={l.href} aria-current={active ? 'page' : undefined} className={`-my-2.5 inline-block py-2.5 ${active ? 'text-accent' : ''}`}>
              {l.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
