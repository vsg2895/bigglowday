import type { BreadcrumbList, Product, WithContext } from 'schema-dts'
import type { PerfumeProduct } from '@shared/types/perfume'
import { SITE_NAME, SITE_URL } from './config'

export interface Crumb {
  label: string
  href?: string
}

export function breadcrumbJsonLd(crumbs: Crumb[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  }
}

/**
 * Product schema. `offers` is emitted ONLY when at least one full-size
 * variant has a price — an offer with no price is invalid structured data,
 * and the design's [PRICE] is a fact the store may not have yet.
 */
export function productJsonLd(product: PerfumeProduct): WithContext<Product> {
  const priced = product.variants.filter((v) => !v.is_sample && v.price !== null)
  const prices = priced.map((v) => v.price as number)
  const images = product.images.map((i) => i.url).filter((u): u is string => !!u)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand?.name ?? ''} ${product.name}`.trim(),
    url: `${SITE_URL}/product/${product.slug}`,
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand.name } } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(images.length ? { image: images } : {}),
    ...(product.description ? { description: product.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } : {}),
    ...(prices.length
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: priced.some((v) => v.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: SITE_NAME },
          },
        }
      : {}),
  }
}

export function JsonLd({ data }: { data: object }): React.JSX.Element {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
