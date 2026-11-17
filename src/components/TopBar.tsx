import Link from 'next/link'
import type { PerfumeSettings } from '@shared/types/perfume'
import { fillTokens, withFact } from '@/lib/format'

/**
 * The thin bar above the header. Every item is a fact: the sale line needs
 * a percentage, the phone and hours need values; whatever is empty is not
 * rendered.
 *
 * The design put a language and a currency switcher on the right. This shop
 * trades in English and US dollars only, so they are STATED rather than
 * offered: a control that cannot change anything is worse than a label.
 */
export default function TopBar({ settings }: { settings: PerfumeSettings }): React.JSX.Element {
  const sale = fillTokens(settings.topbar_sale_text, settings)
  const hours = withFact(settings.hours, (h) => `Open daily ${h}`)

  return (
    <div className="border-b border-line px-[clamp(20px,4vw,56px)]">
      <div className="mx-auto flex min-h-[44px] max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13px] text-muted">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {sale && (
            <Link href="/catalog?on_sale=1" className="font-semibold text-accent">
              {sale}
            </Link>
          )}
          {settings.phone && <span>{settings.phone}</span>}
          {hours && <span>{hours}</span>}
        </div>
        <div className="flex items-center gap-5">
          <span>
            <strong className="font-semibold text-ink">English</strong> · <strong className="font-semibold text-ink">USD</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
