import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook the backend's RevalidatePerfumeSite job calls after an admin edit.
 * Every fetch carries the `perfume` tag, so that one is always refreshed.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.PERFUME_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let tags: string[] = []
  try {
    const body = (await req.json()) as { tags?: unknown }
    if (Array.isArray(body.tags) && body.tags.every((t) => typeof t === 'string')) tags = body.tags as string[]
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const all = Array.from(new Set(['perfume', ...tags]))
  all.forEach((tag) => revalidateTag(tag, 'max'))
  return NextResponse.json({ ok: true, revalidated: all })
}
