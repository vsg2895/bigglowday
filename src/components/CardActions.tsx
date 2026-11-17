'use client'

import type { PerfumeProductCard } from '@shared/types/perfume'
import { HeartIcon } from './Icons'
import { addToCart, toggleFavorite, useFavorites } from '@/lib/store'

/** The favourite and "Add to cart" buttons on a card — the card's shown variant is what gets added. */
export default function CardActions({ card }: { card: PerfumeProductCard }): React.JSX.Element {
  const favorites = useFavorites()
  const fav = favorites.includes(card.slug)
  const canAdd = card.default_variant_id !== null

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={fav}
        onClick={() => toggleFavorite(card.slug)}
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-line bg-transparent ${fav ? 'text-accent' : 'text-ink'}`}
      >
        <HeartIcon size={18} filled={fav} />
      </button>
      <button
        type="button"
        disabled={!canAdd}
        onClick={() =>
          canAdd &&
          addToCart({
            slug: card.slug,
            variantId: card.default_variant_id as number,
            name: card.name,
            brand: card.brand ?? '',
            label: card.default_variant_label ?? '',
            price: card.price,
          })
        }
        className="h-11 whitespace-nowrap rounded-full border border-ink bg-transparent px-[18px] font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add to cart
      </button>
    </div>
  )
}
