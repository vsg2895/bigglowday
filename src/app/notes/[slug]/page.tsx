import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNote, getNotes, type SearchParams } from '@/lib/api'
import Listing from '@/components/Listing'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await getNotes()).map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getNote(slug, {})
  if (!data) return {}
  return { title: data.note.meta_title ?? `${data.note.name} fragrances`, description: data.note.meta_description ?? undefined, alternates: { canonical: `/notes/${data.note.slug}` } }
}

export default async function NotePage({ params, searchParams }: Props): Promise<React.JSX.Element> {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const data = await getNote(slug, sp)
  if (!data) notFound()
  const { note, ...listing } = data

  return (
    <Listing
      basePath={`/notes/${note.slug}`}
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Scent notes', href: '/notes' }, { label: note.name }]}
      title={`${note.name} fragrances`}
      listing={listing}
      aboutTitle={`About ${note.name.toLowerCase()}`}
      aboutHtml={note.description}
    />
  )
}
