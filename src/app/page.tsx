import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getHome, getNav, getSettings } from '@/lib/api'
import { fillTokens, withFact } from '@/lib/format'
import NewArrivals from '@/components/NewArrivals'

export const metadata: Metadata = { alternates: { canonical: '/' } }

const H2 = 'm-0 font-display text-[40px] font-normal leading-[1.1]'
const SECTION = 'px-[clamp(20px,4vw,56px)] pb-[88px]'
const WRAP = 'mx-auto max-w-[1320px]'

/** The three hero tiles, in the design's three shapes, by position. */
const TILE_SHAPES = [
  'min-h-[420px] bg-secondary text-bg rounded-[4px_120px_4px_4px]',
  'min-h-[340px] bg-surface-2 border border-line rounded',
  'min-h-[480px] bg-accent text-bg rounded-[120px_4px_4px_4px]',
]

export default async function HomePage(): Promise<React.JSX.Element> {
  const [settings, home, nav] = await Promise.all([getSettings(), getHome(), getNav()])

  // Hero title: the part between *asterisks* is the italic accent clause of the design.
  const title = settings.hero_title ?? ''
  const em = /^(.*?)\*([^*]+)\*(.*)$/.exec(title)
  const titleHead = em ? em[1] : title
  const titleEm = em ? em[2] : ''
  const titleTail = em ? em[3] : ''

  const samplesText = fillTokens(settings.samples_text, settings)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="px-[clamp(20px,4vw,56px)] pb-[72px] pt-16">
        <div className={`${WRAP} flex flex-wrap items-end gap-12`}>
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-7 pb-3">
            {settings.hero_eyebrow && <div className="text-[13px] uppercase tracking-[0.14em] text-muted">{settings.hero_eyebrow}</div>}
            <h1 className="m-0 font-display text-[clamp(44px,6vw,88px)] font-normal leading-[0.98] [text-wrap:balance]">
              {titleHead}
              {titleEm && <em className="text-accent">{titleEm}</em>}
              {titleTail}
            </h1>
            {settings.hero_text && <p className="m-0 max-w-[460px] text-[17px] text-muted">{settings.hero_text}</p>}
            <div className="flex flex-wrap items-center gap-5">
              {settings.hero_cta_primary_label && (
                <Link href={settings.hero_cta_primary_url ?? '/catalog'} className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-[16px] font-semibold text-bg">
                  {settings.hero_cta_primary_label}
                </Link>
              )}
              {settings.hero_cta_secondary_label && (
                <Link href={settings.hero_cta_secondary_url ?? '#samples'} className="-my-2.5 inline-block py-2.5 underline underline-offset-[5px]">
                  {settings.hero_cta_secondary_label}
                </Link>
              )}
            </div>
          </div>
          {home.hero_tiles.length > 0 && (
            <div className="grid min-w-0 flex-[1_1_520px] grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] items-end gap-4">
              {home.hero_tiles.map((tile, i) => (
                <Link key={tile.id} href={tile.url ?? '/catalog'} className={`relative box-border flex flex-col justify-between overflow-hidden p-6 ${TILE_SHAPES[i % TILE_SHAPES.length]}`}>
                  {tile.image_url && <Image src={tile.image_url} alt="" fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover opacity-60" />}
                  <span className={`relative text-[13px] uppercase tracking-[0.12em] ${i % 3 === 1 ? 'text-muted' : ''} ${i % 3 === 2 ? 'self-end' : ''}`}>{tile.number}</span>
                  <span className="relative font-display text-[40px] leading-none">{tile.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Notes ──────────────────────────────────────────────────────── */}
      {home.note_chips.length > 0 && (
        <section className="px-[clamp(20px,4vw,56px)] pb-20">
          <div className={`${WRAP} flex flex-col gap-6`}>
            <h2 className={H2}>{settings.notes_title ?? 'Start from a note'}</h2>
            <div className="flex flex-wrap gap-3">
              {home.note_chips.map((n) => (
                <Link key={n.id} href={`/notes/${n.slug}`} className="inline-flex h-[52px] items-center rounded-full border border-line px-7 text-[17px]">
                  {n.name}
                </Link>
              ))}
              <Link href="/notes" className="inline-flex h-[52px] items-center rounded-full px-7 text-[17px] text-muted">
                All notes →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── New arrivals ───────────────────────────────────────────────── */}
      {home.new_arrivals.length > 0 && <NewArrivals title={settings.new_arrivals_title ?? 'New arrivals'} products={home.new_arrivals} />}

      {/* ── Samples ────────────────────────────────────────────────────── */}
      {settings.samples_title && (
        <section id="samples" className={SECTION}>
          <div className={`${WRAP} box-border flex flex-wrap items-center gap-10 rounded-[4px_4px_160px_4px] bg-secondary p-[clamp(28px,5vw,64px)] text-bg`}>
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
              <div className="text-[13px] uppercase tracking-[0.14em]">Samples</div>
              <h2 className="m-0 font-display text-[clamp(36px,4.5vw,60px)] font-normal leading-none">{settings.samples_title}</h2>
              {samplesText && <p className="m-0 max-w-[480px] text-[17px]">{samplesText}</p>}
              {settings.samples_cta_label && (
                <Link href={settings.samples_cta_url ?? '/category/samples'} className="inline-flex h-[52px] items-center self-start rounded-full bg-bg px-7 font-semibold text-ink hover:text-accent">
                  {settings.samples_cta_label}
                </Link>
              )}
            </div>
            {settings.samples_steps.length > 0 && (
              <ol className="m-0 flex min-w-0 flex-[1_1_320px] list-none flex-col p-0">
                {settings.samples_steps.map((step, i) => (
                  <li key={i} className={`flex items-baseline gap-5 border-t border-bg py-[18px] ${i === settings.samples_steps.length - 1 ? 'border-b' : ''}`}>
                    <span className="font-display text-[32px] leading-none">{i + 1}</span>
                    <span className="text-[17px]">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      )}

      {/* ── Brands ─────────────────────────────────────────────────────── */}
      {home.featured_brands.length > 0 && (
        <section className={SECTION}>
          <div className={`${WRAP} flex flex-col gap-7`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className={H2}>{settings.brands_title ?? 'Houses we carry'}</h2>
              <Link href="/brands" className="-my-2.5 inline-block py-2.5 underline underline-offset-[5px]">
                All brands A–Z
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] border-l border-t border-line">
              {home.featured_brands.map((b) => (
                <Link key={b.id} href={`/brands/${b.slug}`} className="flex min-h-[88px] items-center border-b border-r border-line px-6 font-display text-[24px]">
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Service cards ──────────────────────────────────────────────── */}
      {home.services.length > 0 && (
        <section className={SECTION}>
          <div className={`${WRAP} grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5`}>
            {home.services.map((card) => {
              const text = fillTokens(card.text, settings)
              return (
                <div key={card.id} className="flex flex-col gap-3 rounded border border-line bg-surface p-8">
                  <h3 className="m-0 font-display text-[30px] font-normal leading-[1.1]">{card.title}</h3>
                  {text && <p className="m-0 text-muted">{text}</p>}
                  {card.link_label &&
                    (card.url ? (
                      <Link href={card.url} className="text-accent">
                        {card.link_label}
                      </Link>
                    ) : (
                      <span className="text-muted" title="Coming soon">
                        {card.link_label}
                      </span>
                    ))}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Stores ─────────────────────────────────────────────────────── */}
      {nav.stores.length > 0 && (
        <section className={SECTION}>
          <div className={`${WRAP} flex flex-wrap gap-5`}>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
              <h2 className={H2}>{settings.stores_title ?? 'Visit a store'}</h2>
              {nav.stores.map((s, i) => {
                const hours = withFact(s.hours, (h) => `Daily ${h}`)
                return (
                  <div key={s.id} className={`flex flex-col gap-1 border-t border-line py-5 ${i === nav.stores.length - 1 ? 'border-b' : ''}`}>
                    <div className="font-semibold">{s.address}</div>
                    {(hours || s.map_url) && (
                      <div className="text-muted">
                        {hours}
                        {hours && s.map_url && ' · '}
                        {s.map_url && (
                          <a href={s.map_url} target="_blank" rel="noopener" className="underline">
                            Route
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {settings.map_embed_url && (
              <div className="min-h-[320px] min-w-0 flex-[2_1_480px] overflow-hidden rounded border border-line bg-surface">
                <iframe src={settings.map_embed_url} title="Map of stores" className="h-full min-h-[320px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
