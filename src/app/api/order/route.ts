import { NextRequest, NextResponse } from 'next/server'
import { perfumePost } from '@/lib/api'

/** The order form posts here; the key stays on the server. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  const { status, body } = await perfumePost('/orders', payload)

  return NextResponse.json(body, { status })
}
