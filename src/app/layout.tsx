import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import { getNav, getSettings } from '@/lib/api'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import TopBar from '@/components/TopBar'
import SiteHeader from '@/components/SiteHeader'
import CatalogNav from '@/components/CatalogNav'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

// The design's two faces: Instrument Serif (display, regular + italic) and Inter (text).
const inter = Inter({ variable: '--font-inter', subsets: ['latin'], weight: ['400', '500', '600'] })
const instrument = Instrument_Serif({ variable: '--font-instrument', subsets: ['latin'], weight: '400', style: ['normal', 'italic'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings.site_name || SITE_NAME
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.meta_title ?? name, template: `%s | ${name}` },
    description: settings.meta_description ?? undefined,
    openGraph: { siteName: name, type: 'website' },
  }
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F0F14' }

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const [settings, nav] = await Promise.all([getSettings(), getNav()])

  const links = [
    ...nav.categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
    ...nav.header.map((i) => ({ label: i.label, href: i.url })),
  ]

  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable}`} style={{ ['--accent' as string]: settings.accent_color }}>
      <body className="bg-bg text-ink antialiased">
        <TopBar settings={settings} />
        <SiteHeader settings={settings} />
        <CatalogNav links={links} />
        {children}
        <SiteFooter settings={settings} nav={nav} />
      </body>
    </html>
  )
}
