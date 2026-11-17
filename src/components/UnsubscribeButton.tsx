'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * Opting out, from the link in an email.
 *
 * A click, not a page load: a GET opt-out is followed by mail clients
 * scanning the message and would unsubscribe people who never touched it.
 */
export default function UnsubscribeButton({ token }: { token: string }): React.JSX.Element {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  async function submit(): Promise<void> {
    setState('sending')
    try {
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch {
      // The server answers the same for a good and an unknown token, and a
      // network blip should not leave the reader stuck on a spinner.
    }
    setState('done')
  }

  if (state === 'done') {
    return (
      <div className="flex flex-col items-start gap-5">
        <p role="status" className="m-0 text-[17px] text-muted">
          Done — you will not hear from us again. You can subscribe any time from the shop.
        </p>
        <Link href="/" className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-[16px] font-semibold text-bg">
          Back to the shop
        </Link>
      </div>
    )
  }

  return (
    <button type="button" onClick={submit} disabled={state === 'sending'} className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-[16px] font-semibold text-bg disabled:opacity-60">
      {state === 'sending' ? 'Unsubscribing…' : 'Unsubscribe me'}
    </button>
  )
}
