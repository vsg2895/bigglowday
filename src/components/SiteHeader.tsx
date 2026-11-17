import Link from 'next/link'
import type { PerfumeSettings } from '@shared/types/perfume'
import HeaderActions from './HeaderActions'
import SubscribeForm from './SubscribeForm'
import { SearchIcon } from './Icons'

/**
 * Wordmark, search (a plain GET to /catalog?q=), the action buttons and the
 * mailing-list sign-up. The row wraps, so on a narrow screen each pill takes
 * a line of its own rather than shrinking into uselessness.
 */
export default function SiteHeader({ settings }: { settings: PerfumeSettings }): React.JSX.Element {
  return (
    <header className="px-[clamp(20px,4vw,56px)]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-8 gap-y-4 py-[22px]">
        <Link href="/" className="font-display text-[34px] leading-none tracking-[0.01em]" aria-label={`${settings.site_name} — home`}>
          {settings.site_name}
        </Link>
        <form role="search" action="/catalog" method="get" className="box-border flex h-12 flex-[1_1_280px] items-center gap-2.5 rounded-full border border-line bg-surface px-[18px]">
          <SearchIcon />
          <input
            type="search"
            name="q"
            aria-label="Search fragrances, brands, notes"
            placeholder="Search fragrances, brands, notes"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-ink outline-0 placeholder:text-muted"
          />
        </form>
        <HeaderActions />
        <SubscribeForm />
      </div>
    </header>
  )
}
