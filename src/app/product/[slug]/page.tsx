import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getSettings, getSitemap } from '@/lib/api'
import { genderLabel, genderPhrase } from '@/lib/format'
import { JsonLd, productJsonLd } from '@/lib/seo'
import Breadcrumbs from '@/components/Breadcrumbs'
import Gallery from '@/components/Gallery'
import ProductBuy from '@/components/ProductBuy'
import ProductCard from '@/components/ProductCard'

type Props = { params: Promise<{ slug: string }> }

const H2 = 'm-0 font-display text-[40px] font-normal leading-[1.1]'

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await getSitemap()).products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getProduct(slug)
  if (!data) return {}
  const p = data.product
  const full = `${p.brand?.name ?? ''} ${p.name}`.trim()
  return {
    title: p.meta_title ?? full,
    description: p.meta_description ?? (p.description ? p.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) : undefined),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { images: p.images.map((i) => i.url).filter((u): u is string => !!u) },
  }
}

export default async function ProductPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params
  const [data, settings] = await Promise.all([getProduct(slug), getSettings()])
  if (!data) notFound()
  const { product: p, related } = data
  const full = `${p.brand?.name ?? ''} ${p.name}`.trim()

  const section = p.categories[0]
  const crumbs = [
    { label: 'Home', href: '/' },
    section ? { label: section.title ?? section.name, href: `/category/${section.slug}` } : { label: genderLabel(p.gender), href: '/catalog' },
    ...(p.brand ? [{ label: p.brand.name, href: `/brands/${p.brand.slug}` }] : []),
    { label: p.name },
  ]

  const subtitle = [p.type_label, genderPhrase(p.gender), p.scent_family?.name.toLowerCase()].filter(Boolean).join(' · ')
  const notes = (['top', 'heart', 'base'] as const).map((layer) => ({ layer, names: p.notes[layer].map((n) => n.name) })).filter((l) => l.names.length > 0)

  // Details rows: only the facts the product has.
  const details: { label: string; value: React.ReactNode }[] = [
    { label: 'Gender', value: genderLabel(p.gender) },
    { label: 'Type', value: p.type_label },
  ]
  if (p.scent_family) details.push({ label: 'Scent family', value: p.scent_family.name })
  if (p.year) details.push({ label: 'Year', value: String(p.year) })
  if (p.perfumer) {
    details.push({
      label: 'Perfumer',
      value: (
        <Link href={`/perfumers/${p.perfumer.slug}`} className="underline underline-offset-4">
          {p.perfumer.name}
        </Link>
      ),
    })
  }
  if (p.country) details.push({ label: 'Country', value: p.country })

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <JsonLd data={productJsonLd(p)} />
      <div className="mx-auto flex max-w-[1320px] flex-col gap-[72px]">
        <div className="flex flex-col gap-6">
          <Breadcrumbs crumbs={crumbs} />
          <div className="flex flex-wrap items-stretch gap-12">
            <Gallery images={p.images} tint={p.tint} alt={full} />

            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap justify-between gap-3 text-[12px] uppercase tracking-[0.12em] text-muted">
                  {p.brand && (
                    <Link href={`/brands/${p.brand.slug}`} className="-my-3 inline-block py-3 text-muted underline underline-offset-4">
                      {p.brand.name}
                    </Link>
                  )}
                  {p.sku && <span>Code {p.sku}</span>}
                </div>
                <h1 className="m-0 font-display text-[clamp(48px,6vw,80px)] font-normal leading-[0.95]">{p.name}</h1>
                <div className="text-[17px] text-muted">{subtitle}</div>
                {p.rating !== null && (
                  <div className="text-[14px] text-muted">
                    {p.rating.toFixed(1)} ★
                    {p.reviews_count !== null && (
                      <>
                        {' · '}
                        <a href="#reviews" className="underline underline-offset-4">
                          {p.reviews_count} {p.reviews_count === 1 ? 'review' : 'reviews'}
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>

              <ProductBuy product={p} settings={settings} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-12">
          {notes.length > 0 && (
            <section className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
              <h2 className={H2}>Notes</h2>
              <div className="flex flex-col">
                {notes.map((l, i) => (
                  <div key={l.layer} className={`flex flex-wrap gap-x-6 gap-y-2 border-t border-line py-5 ${i === notes.length - 1 ? 'border-b' : ''}`}>
                    <span className="flex-[0_0_90px] pt-1.5 text-[12px] uppercase tracking-[0.12em] text-accent">{l.layer}</span>
                    <span className="flex-[1_1_240px] font-display text-[26px] leading-[1.2]">{l.names.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
            <h2 className={H2}>Details</h2>
            <dl className="m-0 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] rounded border border-line bg-surface px-6 py-2">
              {details.map((row, i) => {
                const border = i === details.length - 1 ? '' : 'border-b border-line'
                return (
                  <div key={row.label} className="contents">
                    <dt className={`py-3.5 text-muted ${border}`}>{row.label}</dt>
                    <dd className={`m-0 py-3.5 ${border}`}>{row.value}</dd>
                  </div>
                )
              })}
            </dl>
          </section>
        </div>

        {p.description && (
          <section className="flex flex-col gap-5">
            <h2 className={H2}>About {p.name}</h2>
            <div className="prose-store max-w-[760px] text-[17px] text-muted" dangerouslySetInnerHTML={{ __html: p.description }} />
          </section>
        )}

        {/* Reviews are not built: the block says so instead of pretending. */}
        <section id="reviews" className="flex flex-col gap-5">
          <h2 className={H2}>Reviews</h2>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-dashed border-line-soft p-7 text-muted">
            <span>Customer reviews are coming soon.</span>
            <button type="button" disabled title="Reviews are not available yet" className="h-12 cursor-not-allowed rounded-full border border-ink bg-transparent px-6 font-semibold text-ink opacity-50">
              Write a review
            </button>
          </div>
        </section>

        {related.length > 0 && (
          <section className="flex flex-col gap-7">
            <h2 className={H2}>In the same family</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
              {related.map((card) => (
                <ProductCard key={card.id} card={card} variant="related" />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
