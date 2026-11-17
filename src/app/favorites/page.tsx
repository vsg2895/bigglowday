import type { Metadata } from 'next'
import { getCatalog } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import FavoritesList from '@/components/FavoritesList'

export const metadata: Metadata = { title: 'Favorites', robots: { index: false } }

/** Favourites live in the browser; the page ships the catalog's cards and the client keeps the saved ones. */
export default async function FavoritesPage(): Promise<React.JSX.Element> {
  const listing = await getCatalog({ page: '1' })

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Favorites' }]} />
          <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">Favorites</h1>
          <p className="m-0 text-muted">Saved in this browser only.</p>
        </div>
        <FavoritesList products={listing.products} />
      </div>
    </main>
  )
}
