import { NextRequest, NextResponse } from 'next/server'
import { perfumePost } from '@/lib/api'

/** The unsubscribe page posts here. POST only — a GET opt-out would be
 *  followed by mail clients and opt people out before they read anything. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const { status, body } = await perfumePost('/unsubscribe', payload)

  return NextResponse.json(body, { status })
}
