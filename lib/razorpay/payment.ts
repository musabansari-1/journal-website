export type RazorpayEnv = { RAZORPAY_KEY_ID: string; RAZORPAY_KEY_SECRET: string }

export async function createPaymentLink(env: RazorpayEnv, data: {
  paperId: string; paperTitle: string; authorName: string
  email: string; phone: string; amount: number; callbackUrl: string
}): Promise<{ id: string; short_url: string }> {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)
  const response = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: data.amount, currency: 'INR', accept_partial: false,
      description: `Publication fee: ${data.paperTitle.substring(0, 100)}`,
      customer: { name: data.authorName, email: data.email, contact: data.phone },
      notify: { email: true, sms: true },
      reminder_enable: true,
      callback_url: data.callbackUrl,
      callback_method: 'get',
      notes: { paper_id: data.paperId },
      expire_by: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
    })
  })
  if (!response.ok) throw new Error(`Payment link failed: ${await response.text()}`)
  return response.json() as Promise<{ id: string; short_url: string }>
}

export async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === signature
}

export async function getPaymentDetails(env: RazorpayEnv, paymentId: string) {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers: { 'Authorization': `Basic ${auth}` } })
  if (!res.ok) return null
  return res.json() as Promise<{ id: string; status: string; amount: number; notes: Record<string, string> }>
}
