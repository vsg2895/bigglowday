'use client'

import { useState } from 'react'
import type { PerfumeProduct, PerfumeSettings } from '@shared/types/perfume'
import { HeartIcon } from './Icons'
import { addToCart, toggleFavorite, useFavorites } from '@/lib/store'
import { formatPrice } from '@/lib/format'

/**
 * Volume picker, price, "Add to cart" and favourite — the buy box of the
 * product page. Price and stock are facts of the picked variant: no price
 * reads "Price on request", stock 0 shows only the volume.
 */
export default function ProductBuy({ product, settings }: { product: PerfumeProduct; settings: PerfumeSettings }): React.JSX.Element {
  const variants = product.variants
  const initial = variants.find((v) => !v.is_sample) ?? variants[0]
  const [pickedId, setPickedId] = useState<number | null>(initial?.id ?? null)
  const picked = variants.find((v) => v.id === pickedId) ?? null
  const favorites = useFavorites()
  const fav = favorites.includes(product.slug)

  const localDelivery = settings.delivery_local_time
    ? `${settings.delivery_local_time}${settings.delivery_free_from !== null ? `, free from ${formatPrice(settings.delivery_free_from)}` : ''}`
    : null
  const rows = [
    ['Local delivery', localDelivery],
    ['Nationwide', settings.delivery_national_time ? `${settings.delivery_national_time} by post` : null],
    ['Bonus points', settings.bonus_percent !== null ? `+${settings.bonus_percent}% back on this order` : null],
  ].filter((r): r is [string, string] => !!r[1])

  return (
    <>
      {variants.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-[12px] uppercase tracking-[0.12em] text-muted">Volume</div>
          <div role="group" aria-label="Volume" className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const on = v.id === pickedId
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPickedId(v.id)}
                  className={`h-[52px] rounded-full border px-6 font-semibold ${on ? 'border-ink bg-ink text-bg' : 'border-line bg-transparent text-ink'}`}
                >
                  {v.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-4">
        <div className="font-display text-[48px] leading-none">{picked?.price != null ? formatPrice(picked.price) : <span className="text-[28px] text-muted">Price on request</span>}</div>
        {picked && (
          <div className="text-muted">
            {picked.label}
            {picked.stock > 0 && ' · in stock'}
            {picked.old_price !== null && picked.price !== null && picked.old_price > picked.price && <s className="ml-3">{formatPrice(picked.old_price)}</s>}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!picked}
          onClick={() =>
            picked &&
            addToCart({
              slug: product.slug,
              variantId: picked.id,
              name: product.name,
              brand: product.brand?.name ?? '',
              label: picked.label,
              price: picked.price,
            })
          }
          className="h-[60px] flex-[1_1_240px] rounded-full bg-accent text-[17px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to cart
        </button>
        <button
          type="button"
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={fav}
          onClick={() => toggleFavorite(product.slug)}
          className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border border-line bg-transparent ${fav ? 'text-accent' : 'text-ink'}`}
        >
          <HeartIcon size={22} filled={fav} />
        </button>
      </div>

      {rows.length > 0 && (
        <div className="flex flex-col">
          {rows.map(([label, value], i) => (
            <div key={label} className={`flex justify-between gap-4 border-t border-line py-3.5 ${i === rows.length - 1 ? 'border-b' : ''}`}>
              <span className="text-muted">{label}</span>
              <span className="text-right">{value}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
