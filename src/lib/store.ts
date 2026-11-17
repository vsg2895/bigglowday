'use client'

/**
 * Cart and favourites, client-side only (localStorage) — there is no
 * checkout and no account. One tiny external store per list, read with
 * useSyncExternalStore so every counter and button on the page agrees.
 *
 * Storage can be missing (private mode, blocked site data): every read and
 * write is guarded and the page renders with empty lists.
 */
import { useSyncExternalStore } from 'react'

export interface CartLine {
  slug: string
  variantId: number
  name: string
  brand: string
  label: string
  price: number | null
  qty: number
}

const CART_KEY = 'bgd:cart'
const FAV_KEY = 'bgd:favorites'
const EVENT = 'bgd:store'

const EMPTY_CART: CartLine[] = []
const EMPTY_FAV: string[] = []

let cartCache: CartLine[] = EMPTY_CART
let favCache: string[] = EMPTY_FAV
let cartRaw: string | null = null
let favRaw: string | null = null

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — the in-memory state still updates below */
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

// Snapshots must be referentially stable between reads, or React loops.
function cartSnapshot(): CartLine[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(CART_KEY)
  } catch {
    raw = null
  }
  if (raw !== cartRaw) {
    cartRaw = raw
    cartCache = read<CartLine[]>(CART_KEY, EMPTY_CART)
  }
  return cartCache
}

function favSnapshot(): string[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(FAV_KEY)
  } catch {
    raw = null
  }
  if (raw !== favRaw) {
    favRaw = raw
    favCache = read<string[]>(FAV_KEY, EMPTY_FAV)
  }
  return favCache
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, cartSnapshot, () => EMPTY_CART)
}

export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, favSnapshot, () => EMPTY_FAV)
}

export function addToCart(line: Omit<CartLine, 'qty'>): void {
  const cart = [...cartSnapshot()]
  const i = cart.findIndex((l) => l.variantId === line.variantId)
  if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + 1 }
  else cart.push({ ...line, qty: 1 })
  write(CART_KEY, cart)
}

export function removeFromCart(variantId: number): void {
  write(
    CART_KEY,
    cartSnapshot().filter((l) => l.variantId !== variantId),
  )
}

/** Everything out of the cart — used once an order has been placed. */
export function clearCart(): void {
  write(CART_KEY, [])
}

export function setQty(variantId: number, qty: number): void {
  if (qty < 1) {
    removeFromCart(variantId)
    return
  }
  write(
    CART_KEY,
    cartSnapshot().map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(99, qty) } : l)),
  )
}

export function toggleFavorite(slug: string): void {
  const favs = favSnapshot()
  write(FAV_KEY, favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug])
}
