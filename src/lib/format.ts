import type { PerfumeGender, PerfumeSettings } from '@shared/types/perfume'

/**
 * 129.99 → "$129.99", 129 → "$129".
 *
 * Cents only when there are cents: a bottle priced at a round $120 should
 * not carry ".00" on every shelf label.
 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export function genderLabel(gender: PerfumeGender): string {
  return { women: 'Women', men: 'Men', unisex: 'Unisex' }[gender]
}

export function genderPhrase(gender: PerfumeGender): string {
  return { women: 'for women', men: 'for men', unisex: 'unisex' }[gender]
}

/** The settings values a text may reference as `{token}`. */
const TOKENS: (keyof PerfumeSettings)[] = [
  'sale_percent',
  'delivery_local_time',
  'delivery_free_from',
  'delivery_national_time',
  'bonus_percent',
  'samples_max_per_order',
  'phone',
  'email',
  'hours',
]

/**
 * Fill `{token}` holes from the settings. A SENTENCE whose token is empty is
 * dropped rather than printed with a hole — "Springfield: , free from ." is
 * worse than no sentence — and a text left with nothing returns null so the
 * caller can hide the element. The design's bracketed facts all go through
 * here.
 */
export function fillTokens(text: string | null | undefined, settings: PerfumeSettings): string | null {
  if (!text) return null
  const sentences = text.split(/(?<=[.!?])\s+/)
  const kept: string[] = []
  for (const sentence of sentences) {
    let out = sentence
    let missing = false
    for (const key of TOKENS) {
      const hole = `{${key}}`
      if (!out.includes(hole)) continue
      const value = settings[key]
      if (value === null || value === undefined || value === '') {
        missing = true
        break
      }
      // `delivery_free_from` is money, so it is written as money.
      out = out.split(hole).join(key === 'delivery_free_from' ? formatPrice(Number(value)) : String(value))
    }
    if (!missing) kept.push(out)
  }
  const joined = kept.join(' ').trim()
  return joined === '' ? null : joined
}

/** "Open daily [HOURS]" and friends: the text only when the fact exists. */
export function withFact<T>(fact: T | null | undefined, render: (fact: T) => string): string | null {
  return fact === null || fact === undefined || fact === '' ? null : render(fact)
}
