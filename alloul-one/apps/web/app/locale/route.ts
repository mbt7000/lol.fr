import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const locale = String(form.get('locale') || 'en')
  const res = NextResponse.redirect(new URL(req.headers.get('referer') || '/', req.url))
  res.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}
