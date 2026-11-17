'use client'

import { useState } from 'react'
import Link from 'next/link'
import { clearCart, removeFromCart, setQty, useCart } from '@/lib/store'
import { formatPrice } from '@/lib/format'

interface Placed {
  reference: string
  items_count: number
  total: number | null
}

const FIELD = 'box-border h-12 w-full rounded-[4px] border border-line bg-surface px-4 text-ink outline-0 placeholder:text-muted focus:border-ink'
const LABEL = 'mb-1.5 block text-[12px] uppercase tracking-[0.12em] text-muted'

/**
 * Placing an order. There is NO payment: the shop is told what is wanted and
 * how to reach the buyer, and confirms by phone — so this is a contact form
 * with the basket attached.
 *
 * Only variant ids and quantities are sent. Prices shown here are for the
 * reader; the server reads the real ones back from the catalog, so a basket
 * edited in the console cannot set its own price.
 */
export default function OrderForm(): React.JSX.Element {
  const cart = useCart()
  const [form, setForm] = useState({ customer_name: '', phone: '', email: '', address: '', comment: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [placed, setPlaced] = useState<Placed | null>(null)

  const total = cart.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0)
  const unpriced = cart.some((l) => l.price === null)

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (sending || cart.length === 0) return
    setSending(true)
    setErrors({})
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          email: form.email || null,
          address: form.address || null,
          comment: form.comment || null,
          items: cart.map((l) => ({ variant_id: l.variantId, qty: l.qty })),
        }),
      })
      const body = (await res.json()) as { data?: Placed; errors?: Record<string, string[]>; message?: string }

      if (res.ok && body.data) {
        setPlaced(body.data)
        clearCart()
        return
      }

      const flat: Record<string, string> = {}
      for (const [key, messages] of Object.entries(body.errors ?? {})) {
        flat[key.split('.')[0] ?? key] = messages[0] ?? 'Invalid value'
      }
      setErrors(Object.keys(flat).length > 0 ? flat : { form: body.message ?? 'Could not place the order.' })
    } catch {
      setErrors({ form: 'Could not reach the shop. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  if (placed) {
    return (
      <div className="flex max-w-[620px] flex-col items-start gap-5 rounded border border-line bg-surface p-8">
        <div className="text-[13px] uppercase tracking-[0.14em] text-accent">Order placed</div>
        <h2 className="m-0 font-display text-[40px] font-normal leading-[1.1]">Thank you — we will call you.</h2>
        <p className="m-0 text-[17px] text-muted">
          Your order number is <strong className="font-semibold text-ink">{placed.reference}</strong>. We confirm every order
          by phone and settle payment then — nothing has been charged.
        </p>
        <Link href="/catalog" className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-[16px] font-semibold text-bg">
          Keep looking
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex max-w-[620px] flex-col items-start gap-5 rounded border border-dashed border-line-soft p-8">
        <p className="m-0 text-[17px] text-muted">Your cart is empty.</p>
        <Link href="/catalog" className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-[16px] font-semibold text-bg">
          Browse the catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-start gap-10">
      {/* The basket */}
      <section aria-label="Your cart" className="flex min-w-0 flex-[1_1_380px] flex-col rounded border border-line bg-surface px-6 py-2">
        {cart.map((line, i) => (
          <div key={line.variantId} className={`flex flex-wrap items-center justify-between gap-4 py-5 ${i > 0 ? 'border-t border-line' : ''}`}>
            <div className="min-w-0">
              <div className="text-[12px] uppercase tracking-[0.12em] text-muted">{line.brand}</div>
              <Link href={`/product/${line.slug}`} className="font-display text-[24px] leading-[1.1]">
                {line.name}
              </Link>
              <div className="text-[14px] text-muted">{line.label}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button type="button" aria-label="One fewer" onClick={() => setQty(line.variantId, line.qty - 1)} className="h-9 w-9 rounded-full border border-line text-ink">
                  −
                </button>
                <span className="w-8 text-center tabular-nums">{line.qty}</span>
                <button type="button" aria-label="One more" onClick={() => setQty(line.variantId, line.qty + 1)} className="h-9 w-9 rounded-full border border-line text-ink">
                  +
                </button>
              </div>
              <div className="w-28 text-right font-semibold">
                {line.price !== null ? formatPrice(line.price * line.qty) : <span className="text-[14px] font-normal text-muted">On request</span>}
              </div>
              <button type="button" onClick={() => removeFromCart(line.variantId)} className="text-[13px] text-muted underline underline-offset-4">
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-line py-5">
          <span className="text-muted">{unpriced ? 'Total of the priced items' : 'Total'}</span>
          <span className="font-display text-[28px] leading-none">{total > 0 ? formatPrice(total) : '—'}</span>
        </div>
        {unpriced && (
          <p className="m-0 pb-5 text-[14px] text-muted">
            Some of these have no price listed yet — we will confirm them when we call.
          </p>
        )}
      </section>

      {/* Who to call */}
      <form onSubmit={submit} noValidate className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
        <div>
          <label htmlFor="o-name" className={LABEL}>
            Your name *
          </label>
          <input id="o-name" value={form.customer_name} onChange={set('customer_name')} className={FIELD} autoComplete="name" placeholder="Name for the delivery" />
          {errors.customer_name && <p className="mt-1.5 text-[13px] text-muted">{errors.customer_name}</p>}
        </div>
        <div>
          <label htmlFor="o-phone" className={LABEL}>
            Phone *
          </label>
          <input id="o-phone" value={form.phone} onChange={set('phone')} className={FIELD} autoComplete="tel" inputMode="tel" placeholder="+374 …" />
          {errors.phone && <p className="mt-1.5 text-[13px] text-muted">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="o-email" className={LABEL}>
            Email
          </label>
          <input id="o-email" type="email" value={form.email} onChange={set('email')} className={FIELD} autoComplete="email" placeholder="Where to send the confirmation" />
          {errors.email && <p className="mt-1.5 text-[13px] text-muted">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="o-address" className={LABEL}>
            Delivery address
          </label>
          <input id="o-address" value={form.address} onChange={set('address')} className={FIELD} autoComplete="street-address" placeholder="Street, building, apartment, city" />
        </div>
        <div>
          <label htmlFor="o-comment" className={LABEL}>
            Anything we should know
          </label>
          <textarea id="o-comment" value={form.comment} onChange={set('comment')} rows={3} className={`${FIELD} h-auto py-3`} placeholder="Delivery notes, gift wrap, a preferred time" />
        </div>

        {errors.form && (
          <p role="alert" className="m-0 rounded border border-line-soft p-4 text-[14px] text-muted">
            {errors.form}
          </p>
        )}
        {errors.items && (
          <p role="alert" className="m-0 rounded border border-line-soft p-4 text-[14px] text-muted">
            {errors.items}
          </p>
        )}

        <button type="submit" disabled={sending} className="h-[60px] rounded-full bg-accent text-[17px] font-semibold text-bg disabled:opacity-60">
          {sending ? 'Sending…' : 'Place the order'}
        </button>
        <p className="m-0 text-[14px] text-muted">
          No payment is taken here. We call to confirm the order and agree how you pay.
        </p>
      </form>
    </div>
  )
}
