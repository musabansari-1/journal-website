export type EmailEnv = { RESEND_API_KEY: string }
export async function sendEmail(env: EmailEnv, to: string, subject: string, html: string): Promise<void> {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Nrityanjali Journal <noreply@nrityanjaliresearchjournal.com>', to, subject, html })
  })
  if (!r.ok) console.error('Email failed:', await r.text())
}
