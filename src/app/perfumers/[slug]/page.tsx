import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPerfumer, getPerfumers, type SearchParams } from '@/lib/api'
import Listing from '@/components/Listing'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await getPerfumers()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getPerfumer(slug, {})
  if (!data) return {}
  return { title: data.perfumer.meta_title ?? data.perfumer.name, description: data.perfumer.meta_description ?? undefined, alternates: { canonical: `/perfumers/${data.perfumer.slug}` } }
}

export default async function PerfumerPage({ params, searchParams }: Props): Promise<React.JSX.Element> {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const data = await getPerfumer(slug, sp)
  if (!data) notFound()
  const { perfumer, ...listing } = data

  return (
    <Listing
      basePath={`/perfumers/${perfumer.slug}`}
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Perfumers', href: '/perfumers' }, { label: perfumer.name }]}
      title={perfumer.name}
      listing={listing}
      aboutTitle={`About ${perfumer.name}`}
      aboutHtml={perfumer.description}
    />
  )
}
