import Link from 'next/link'

export default function NotFound(): React.JSX.Element {
  return (
    <main className="px-[clamp(20px,4vw,56px)] pb-[88px] pt-16">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-6">
        <div className="text-[13px] uppercase tracking-[0.14em] text-muted">404</div>
        <h1 className="m-0 font-display text-[clamp(44px,6vw,88px)] font-normal leading-[0.98]">Nothing here.</h1>
        <p className="m-0 max-w-[460px] text-[17px] text-muted">The page may have moved, or the fragrance is no longer in the catalog.</p>
        <Link href="/catalog" className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-[16px] font-semibold text-bg">
          Browse the catalog
        </Link>
      </div>
    </main>
  )
}
