import { NextRequest, NextResponse } from 'next/server'
import { perfumePost } from '@/lib/api'

/**
 * The header's subscribe form posts here, and this calls the perfume API
 * with the site key — which must never reach the browser.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const { status, body } = await perfumePost('/subscribe', payload)

  return NextResponse.json(body, { status })
}
