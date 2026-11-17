'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { PerfumeImage } from '@shared/types/perfume'
import BottlePlaceholder from './BottlePlaceholder'

/** The product's photos in the design's rounded well; the bottle placeholder when it has none. */
export default function Gallery({ images, tint, alt }: { images: PerfumeImage[]; tint: string | null; alt: string }): React.JSX.Element {
  const [index, setIndex] = useState(0)
  const current = images[index] ?? null

  return (
    <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3">
      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[4px_160px_4px_4px] bg-surface-2">
        {current?.url ? (
          <Image src={current.url} alt={current.alt ?? alt} fill sizes="(max-width: 900px) 100vw, 640px" className="object-contain p-10" priority />
        ) : (
          <BottlePlaceholder tint={tint} width={270} height={360} label={`${alt} — no photo yet`} />
        )}
        {images.length > 1 && <span className="absolute bottom-5 left-5 text-[13px] text-muted">Gallery of {images.length} images</span>}
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button key={img.id} type="button" aria-label={`Image ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)} className={`relative h-16 w-16 overflow-hidden rounded border ${i === index ? 'border-ink' : 'border-line'} bg-surface-2`}>
              {img.url && <Image src={img.url} alt="" fill sizes="64px" className="object-contain p-1" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
