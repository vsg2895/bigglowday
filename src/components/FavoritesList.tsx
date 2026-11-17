'use client'

import type { PerfumeProductCard } from '@shared/types/perfume'
import ProductCard from './ProductCard'
import { useFavorites } from '@/lib/store'

/** /favorites: the catalog's cards filtered by what this browser saved. */
export default function FavoritesList({ products }: { products: PerfumeProductCard[] }): React.JSX.Element {
  const favorites = useFavorites()
  const shown = products.filter((p) => favorites.includes(p.slug))

  if (shown.length === 0) {
    return <p className="rounded border border-dashed border-line-soft p-10 text-center text-muted">No favourites yet — tap the heart on any fragrance.</p>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
      {shown.map((card) => (
        <ProductCard key={card.id} card={card} variant="catalog" />
      ))}
    </div>
  )
}
