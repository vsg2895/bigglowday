'use client'

import { useState } from 'react'

type State = 'idle' | 'sending' | 'done' | 'error'

/**
 * The mailing list sign-up that sits in the header.
 *
 * It posts to our own /api/subscribe route, never to the perfume API — the
 * site key is server-only. The backend answers the same way whether the
 * address is new or already on the list, so this shows one thank-you either
 * way rather than leaking who is a customer.
 */
export default function SubscribeForm(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setState('done')
        setMessage('Thanks — check your inbox.')
        setEmail('')
        return
      }
      const body = (await res.json()) as { errors?: Record<string, string[]>; message?: string }
      setState('error')
      setMessage(body.errors?.email?.[0] ?? body.message ?? 'Could not subscribe. Please try again.')
    } catch {
      setState('error')
      setMessage('Could not subscribe. Please try again.')
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="flex h-12 flex-[1_1_240px] items-center rounded-full border border-accent px-5 text-[14px] text-accent">
        {message}
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-[1_1_260px] flex-col gap-1">
      <div className="box-border flex h-12 items-center gap-2 rounded-full border border-line bg-surface pl-5 pr-1.5">
        <label htmlFor="subscribe-email" className="sr-only">
          Your email
        </label>
        <input
          id="subscribe-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder="New arrivals by email"
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-ink outline-0 placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="h-9 shrink-0 rounded-full bg-accent px-4 text-[14px] font-semibold text-bg disabled:opacity-60"
        >
          {state === 'sending' ? '…' : 'Subscribe'}
        </button>
      </div>
      {state === 'error' && (
        <p role="alert" className="px-5 text-[12px] text-muted">
          {message}
        </p>
      )}
    </form>
  )
}
