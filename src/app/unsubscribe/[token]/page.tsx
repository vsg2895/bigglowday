import type { Metadata } from 'next'
import UnsubscribeButton from '@/components/UnsubscribeButton'

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false } }

export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }): Promise<React.JSX.Element> {
  const { token } = await params

  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-16">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-6">
        <div className="text-[13px] uppercase tracking-[0.14em] text-muted">Mailing list</div>
        <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">Leaving the list?</h1>
        <p className="m-0 max-w-[520px] text-[17px] text-muted">
          Confirm below and we will stop emailing you about new arrivals.
        </p>
        <UnsubscribeButton token={token} />
      </div>
    </main>
  )
}
