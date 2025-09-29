import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const store = await cookies()
  const city = store.get('city')?.value || 'Moscow'
  return NextResponse.json({ city })
}

export async function POST(req: Request) {
  const { city } = await req.json()
  const res = NextResponse.json({ ok: true, city })

  res.cookies.set('city', city, {
    path: '/',
    httpOnly: false,
  })

  return res
}
