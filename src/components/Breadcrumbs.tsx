import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd, type Crumb } from '@/lib/seo'

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }): React.JSX.Element {
  return (
    <>
      <nav aria-label="Breadcrumbs" className="flex flex-wrap gap-2 text-[13px] text-muted">
        {crumbs.map((c, i) => (
          <span key={i} className="contents">
            {i > 0 && <span>/</span>}
            {c.href && i < crumbs.length - 1 ? (
              <Link href={c.href} className="-my-3 inline-block py-3 text-muted">
                {c.label}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? 'text-ink' : undefined} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  )
}
