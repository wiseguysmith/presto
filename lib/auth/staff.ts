'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function staffLogin(formData: FormData) {
  const pin = String(formData.get('pin') || '')
  const next = String(formData.get('next') || '/admin')
  const staffPin = process.env.STAFF_PIN
  const sessionToken = process.env.STAFF_SESSION_TOKEN || staffPin

  if (!staffPin || !sessionToken || pin !== staffPin) {
    redirect(`/staff-login?next=${encodeURIComponent(next)}&error=1`)
  }

  const cookieStore = await cookies()
  cookieStore.set('presto_staff_session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 16,
  })

  redirect(next)
}
