import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBrand, getBrands, type SearchParams } from '@/lib/api'
import Listing from '@/components/Listing'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await getBrands()).map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getBrand(slug, {})
  if (!data) return {}
  return { title: data.brand.meta_title ?? `${data.brand.name} fragrances`, description: data.brand.meta_description ?? undefined, alternates: { canonical: `/brands/${data.brand.slug}` } }
}

export default async function BrandPage({ params, searchParams }: Props): Promise<React.JSX.Element> {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const data = await getBrand(slug, sp)
  if (!data) notFound()
  const { brand, ...listing } = data

  return (
    <Listing
      basePath={`/brands/${brand.slug}`}
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Brands A–Z', href: '/brands' }, { label: brand.name }]}
      title={brand.name}
      intro={brand.country ? `House from ${brand.country}` : null}
      listing={listing}
      aboutTitle={`About ${brand.name}`}
      aboutHtml={brand.description}
    />
  )
}
