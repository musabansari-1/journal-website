export function generateId(): string { return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }
export function formatDate(ts: number): string { return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }
export function formatCurrency(paise: number): string { return `₹${(paise / 100).toLocaleString('en-IN')}` }

export const SUBJECTS = ['Arts & Humanities','Commerce & Management','Education','Engineering & Technology','Environmental Science','Law','Library Science','Literature & Linguistics','Mathematics','Medical & Health Sciences','Political Science','Psychology','Science','Social Science','Sociology','Other']

export const STATUS_LABELS: Record<string, string> = { submitted:'Submitted', under_review:'Under Review', revision_required:'Revision Required', accepted:'Accepted', payment_pending:'Payment Pending', payment_received:'Payment Received', published:'Published', rejected:'Rejected' }

export const STATUS_COLORS: Record<string, string> = { submitted:'bg-gray-100 text-gray-700', under_review:'bg-blue-100 text-blue-700', revision_required:'bg-yellow-100 text-yellow-700', accepted:'bg-green-100 text-green-700', payment_pending:'bg-orange-100 text-orange-700', payment_received:'bg-teal-100 text-teal-700', published:'bg-emerald-100 text-emerald-700', rejected:'bg-red-100 text-red-700' }
