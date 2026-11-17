import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getPages } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await getPages()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return { title: page.meta_title ?? page.title, description: page.meta_description ?? undefined, alternates: { canonical: `/info/${page.slug}` } }
}

export default async function InfoPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: page.title }]} />
          <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">{page.title}</h1>
        </div>
        {page.body ? (
          <article className="prose-store max-w-[760px] text-[17px]" dangerouslySetInnerHTML={{ __html: page.body }} />
        ) : (
          <p className="max-w-[760px] rounded border border-dashed border-line-soft p-7 text-muted">This page is being written.</p>
        )}
      </div>
    </main>
  )
}
