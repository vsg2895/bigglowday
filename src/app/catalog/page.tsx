import type { Metadata } from 'next'
import { getCatalog, type SearchParams } from '@/lib/api'
import Listing from '@/components/Listing'

export const metadata: Metadata = { title: 'All fragrances', alternates: { canonical: '/catalog' } }

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<React.JSX.Element> {
  const params = await searchParams
  const listing = await getCatalog(params)
  const q = listing.filters.q

  return (
    <Listing
      basePath="/catalog"
      crumbs={[{ label: 'Home', href: '/' }, { label: q ? `Search: ${q}` : 'All fragrances' }]}
      title={q ? `Results for “${q}”` : 'All fragrances'}
      listing={listing}
    />
  )
}
