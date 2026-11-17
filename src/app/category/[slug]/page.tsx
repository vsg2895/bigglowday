import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategories, getCategory, type SearchParams } from '@/lib/api'
import Listing from '@/components/Listing'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await getCategories()).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getCategory(slug, {})
  if (!data) return {}
  const c = data.category
  return {
    title: c.meta_title ?? c.title ?? c.name,
    description: c.meta_description ?? undefined,
    alternates: { canonical: `/category/${c.slug}` },
  }
}

export default async function CategoryPage({ params, searchParams }: Props): Promise<React.JSX.Element> {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const data = await getCategory(slug, sp)
  if (!data) notFound()
  const { category, ...listing } = data
  const title = category.title ?? category.name

  return (
    <Listing
      basePath={`/category/${category.slug}`}
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Perfume', href: '/catalog' }, { label: title }]}
      title={title}
      listing={listing}
      aboutTitle={`About ${title.toLowerCase()}`}
      aboutHtml={category.description}
    />
  )
}
