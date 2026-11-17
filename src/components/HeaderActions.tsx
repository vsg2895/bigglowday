'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CartIcon, HeartIcon } from './Icons'
import { removeFromCart, useCart, useFavorites } from '@/lib/store'
import { formatPrice } from '@/lib/format'

const ROUND = 'flex h-12 w-12 items-center justify-center rounded-full border border-line bg-transparent text-ink'

/**
 * Favourites and the cart, both counting what this browser stored. There is
 * no sign-in: the shop takes orders by name and phone, so an account would
 * be a door onto nothing.
 *
 * The cart panel lists what is in it and leads to the order form; payment
 * happens on the phone afterwards, so there is no checkout step here.
 */
export default function HeaderActions(): React.JSX.Element {
  const cart = useCart()
  const favorites = useFavorites()
  const [open, setOpen] = useState(false)
  const count = cart.reduce((n, l) => n + l.qty, 0)
  const total = cart.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0)
  const unpriced = cart.some((l) => l.price === null)

  return (
    <div className="relative flex items-center gap-2">
      <Link href="/favorites" aria-label={`Favorites, ${favorites.length} items`} className={`${ROUND} relative`}>
        <HeartIcon filled={favorites.length > 0} />
        {favorites.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-bg">{favorites.length}</span>
        )}
      </Link>
      <button
        type="button"
        aria-label={`Cart, ${count} items`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 items-center gap-2.5 rounded-full bg-accent px-5 font-semibold text-bg"
      >
        <CartIcon />
        Cart · {count}
      </button>

      {open && (
        /* Anchored under the button from `sm`; on a phone the header wraps and the
           button sits left, so the panel is fixed to the viewport instead. */
        <div role="dialog" aria-label="Cart" className="z-20 rounded border border-line bg-surface p-4 shadow-xl max-sm:fixed max-sm:inset-x-5 max-sm:top-16 sm:absolute sm:right-0 sm:top-14 sm:w-[min(360px,calc(100vw-40px))]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.12em] text-muted">Cart</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="-m-2 p-2 text-muted">
              ✕
            </button>
          </div>
          {cart.length === 0 ? (
            <p className="text-sm text-muted">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {cart.map((l) => (
                <li key={l.variantId} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{l.brand}</div>
                    <div className="font-display text-[20px] leading-tight">{l.name}</div>
                    <div className="text-muted">
                      {l.label} × {l.qty}
                      {l.price !== null ? ` · ${formatPrice(l.price * l.qty)}` : ' · price on request'}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFromCart(l.variantId)} className="text-xs text-muted underline underline-offset-4">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && total > 0 && (
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted">{unpriced ? 'Subtotal (priced items)' : 'Subtotal'}</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
          )}
          {cart.length > 0 && total === 0 && <p className="mt-3 border-t border-line pt-3 text-sm text-muted">Prices on request — we will confirm the total with you.</p>}
          {cart.length > 0 && (
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg"
            >
              Order these
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
