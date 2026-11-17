import Image from 'next/image'
import Link from 'next/link'
import type { PerfumeProductCard } from '@shared/types/perfume'
import BottlePlaceholder from './BottlePlaceholder'
import CardActions from './CardActions'
import { formatPrice, genderLabel } from '@/lib/format'

/**
 * A product card as the design draws it in three places: the home grid
 * (gender badge), the catalog (SKU badge, when there is one) and the
 * "In the same family" row (smaller image, no buttons). Price is a fact:
 * with none set the card says "Price on request".
 */
export default function ProductCard({ card, variant = 'catalog' }: { card: PerfumeProductCard; variant?: 'home' | 'catalog' | 'related' }): React.JSX.Element {
  const href = `/product/${card.slug}`
  const full = `${card.brand ?? ''} ${card.name}`.trim()
  const related = variant === 'related'
  const badge = variant === 'home' ? genderLabel(card.gender) : variant === 'catalog' && card.sku ? `Code ${card.sku}` : null

  return (
    <article className="flex flex-col overflow-hidden rounded border border-line bg-surface">
      <Link href={href} aria-label={full} className={`relative flex items-center justify-center bg-surface-2 ${related ? 'h-[220px]' : 'h-[240px]'}`}>
        {card.image_url ? (
          <Image src={card.image_url} alt={card.image_alt ?? full} fill sizes="(max-width: 640px) 100vw, 300px" className="object-contain p-4" />
        ) : (
          <BottlePlaceholder tint={card.tint} width={related ? 105 : 120} height={related ? 140 : 160} />
        )}
        {badge && <span className="absolute left-3.5 top-3.5 text-[12px] uppercase tracking-[0.1em] text-muted">{badge}</span>}
      </Link>
      <div className="flex flex-col gap-1.5 px-[18px] pb-5 pt-[18px]">
        <div className="text-[12px] uppercase tracking-[0.12em] text-muted">{card.brand}</div>
        <Link href={href} className="font-display text-[26px] leading-[1.1]">
          {card.name}
        </Link>
        <div className="text-[14px] text-muted">{card.meta}</div>
        {related ? (
          <div className="mt-2 text-[17px] font-semibold">{card.price !== null ? formatPrice(card.price) : <span className="font-normal text-muted">Price on request</span>}</div>
        ) : (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0 text-[17px] font-semibold">
              {card.price !== null ? (
                <>
                  {formatPrice(card.price)}
                  {card.old_price !== null && card.old_price > card.price && <s className="ml-2 font-normal text-muted">{formatPrice(card.old_price)}</s>}
                </>
              ) : (
                <span className="text-[14px] font-normal leading-tight text-muted">Price on request</span>
              )}
            </div>
            <CardActions card={card} />
          </div>
        )}
      </div>
    </article>
  )
}
