import Link from 'next/link'
import type { PerfumeNav, PerfumeSettings } from '@shared/types/perfume'
import { withFact } from '@/lib/format'

const EYEBROW = 'text-[12px] uppercase tracking-[0.12em] text-muted'

export default function SiteFooter({ settings, nav }: { settings: PerfumeSettings; nav: PerfumeNav }): React.JSX.Element {
  const messengers = [
    ['WhatsApp', settings.whatsapp_url],
    ['Viber', settings.viber_url],
    ['Telegram', settings.telegram_url],
  ].filter((m): m is [string, string] => !!m[1])

  const socials = [
    ['Instagram', settings.instagram_url],
    ['Facebook', settings.facebook_url],
    ['TikTok', settings.tiktok_url],
    ['YouTube', settings.youtube_url],
  ].filter((m): m is [string, string] => !!m[1])

  const hours = withFact(settings.hours, (h) => `Daily ${h}`)
  const contactLines = [settings.phone, settings.email, hours].filter((l): l is string => !!l)

  return (
    <footer className="border-t border-line px-[clamp(20px,4vw,56px)] pb-8 pt-14">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-8">
          <div className="flex flex-col">
            <div className="font-display text-[30px] leading-none">{settings.site_name}</div>
            {contactLines.length > 0 && (
              <div className="text-muted">
                {contactLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < contactLines.length - 1 && <br />}
                  </span>
                ))}
              </div>
            )}
            {messengers.length > 0 && (
              <div className="flex gap-4">
                {messengers.map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noopener" className="inline-flex min-h-11 min-w-11 items-center">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          {nav.footer.map((group) => (
            <div key={group.label} className="flex flex-col">
              <div className={EYEBROW}>{group.label}</div>
              {group.items.map((item) => (
                <Link key={item.id} href={item.url} className="inline-flex min-h-11 min-w-11 items-center">
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 border-t border-line pt-6 text-[13px] text-muted">
          <span>
            © {new Date().getFullYear()} {settings.site_name}
          </span>
          {socials.length > 0 && (
            <span className="flex flex-wrap gap-x-2">
              {socials.map(([label, url], i) => (
                <span key={label}>
                  <a href={url} target="_blank" rel="noopener" className="text-muted">
                    {label}
                  </a>
                  {i < socials.length - 1 && ' ·'}
                </span>
              ))}
            </span>
          )}
          {settings.payment_labels.length > 0 && <span>{settings.payment_labels.join(' · ')}</span>}
        </div>
      </div>
    </footer>
  )
}
