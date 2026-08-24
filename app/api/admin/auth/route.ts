import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string }
    const password = body.password
    const adminPassword = process.env.ADMIN_PASSWORD || 'elsevier2024'

    if (password === adminPassword) {
      const token = btoa(`admin:${Date.now()}:${Math.random().toString(36)}`)
      return NextResponse.json({ success: true, token })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
