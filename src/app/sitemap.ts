import type { MetadataRoute } from 'next'
import { getSitemap } from '@/lib/api'
import { SITE_URL } from '@/lib/config'

function safeDate(value: string | null | undefined): Date {
  const d = value ? new Date(value) : new Date()
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemap()
  const entry = (path: string, updated: string | null, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly'): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: safeDate(updated),
    changeFrequency,
    priority,
  })

  return [
    entry('/', null, 1, 'daily'),
    entry('/catalog', null, 0.9, 'daily'),
    entry('/brands', null, 0.6, 'weekly'),
    entry('/notes', null, 0.5, 'weekly'),
    entry('/perfumers', null, 0.4, 'monthly'),
    ...data.categories.map((c) => entry(`/category/${c.slug}`, c.updated_at, 0.8, 'daily')),
    ...data.products.map((p) => entry(`/product/${p.slug}`, p.updated_at, 0.8, 'weekly')),
    ...data.brands.map((b) => entry(`/brands/${b.slug}`, b.updated_at, 0.6, 'weekly')),
    ...data.notes.map((n) => entry(`/notes/${n.slug}`, n.updated_at, 0.5, 'weekly')),
    ...data.perfumers.map((p) => entry(`/perfumers/${p.slug}`, p.updated_at, 0.4, 'monthly')),
    ...data.pages.map((p) => entry(`/info/${p.slug}`, p.updated_at, 0.4, 'monthly')),
  ]
}
