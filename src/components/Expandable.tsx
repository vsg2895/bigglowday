'use client'

import { useState } from 'react'

/** The category description with the design's "Expand" control once it runs long. */
export default function Expandable({ html, limit = 420 }: { html: string; limit?: number }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const plain = html.replace(/<[^>]+>/g, '')
  const long = plain.length > limit

  return (
    <div className="flex flex-col items-start gap-3">
      <div className={`prose-store max-w-[720px] text-muted ${long && !open ? 'line-clamp-4' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="text-ink underline underline-offset-[5px]">
          {open ? 'Collapse' : 'Expand'}
        </button>
      )}
    </div>
  )
}
