import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import OrderForm from '@/components/OrderForm'

export const metadata: Metadata = { title: 'Your order', robots: { index: false } }

/** The cart lives in the visitor's browser, so the page itself is a shell. */
export default function OrderPage(): React.JSX.Element {
  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Your order' }]} />
          <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-normal leading-none">Your order</h1>
          <p className="m-0 max-w-[620px] text-[17px] text-muted">
            Leave your name and a phone number and we will call to confirm everything. There is no payment on the site.
          </p>
        </div>
        <OrderForm />
      </div>
    </main>
  )
}
