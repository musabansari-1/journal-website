import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
export default function ChargesPage() {
  return (<><Navbar /><main className="pt-16">
    <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center"><h1 className="font-display text-4xl font-bold text-white mb-3">Publication Charges</h1><p className="font-body text-brand-200">Transparent fee structure for publication</p></div>
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[{name:'Indian Authors',price:'₹1,000',note:'Per paper, all disciplines',items:['Peer Review Process','DOI Assignment','Open Access Publication','Digital Certificate','Author Copy (e-version)']},
          {name:'International Authors',price:'$30 USD',note:'Per paper, all disciplines',items:['Peer Review Process','DOI Assignment','Open Access Publication','Digital Certificate','Author Copy (e-version)']},
        ].map(p=><div key={p.name} className="bg-white rounded-2xl border-2 border-brand-200 p-8 shadow-sm"><h3 className="font-display text-2xl font-bold text-brand-900 mb-1">{p.name}</h3><p className="font-sans text-sm text-gray-500 mb-4">{p.note}</p><div className="font-display text-5xl font-bold text-brand-700 mb-6">{p.price}</div><ul className="space-y-3 mb-6">{p.items.map(i=><li key={i} className="flex items-center gap-2 font-sans text-sm text-gray-700"><CheckCircle size={16} className="text-brand-600"/>{i}</li>)}</ul></div>)}
      </div>
      <div className="bg-brand-50 rounded-2xl p-8">
        <h3 className="font-display text-xl font-semibold text-brand-900 mb-4">Important Notes</h3>
        <ul className="space-y-3">{['Submission is FREE — fee is charged only after paper acceptance','Payment link is sent to author email after acceptance','Fee must be paid within 7 days of acceptance to proceed with publication','No refund after payment is processed','Co-author charges may apply — contact us for group discounts'].map(n=><li key={n} className="flex items-start gap-2 font-body text-sm text-gray-700"><CheckCircle size={14} className="text-brand-600 mt-0.5 shrink-0"/>{n}</li>)}</ul>
      </div>
      <div className="mt-8 text-center"><Link href="/submit" className="inline-flex items-center gap-2 font-sans font-semibold bg-brand-700 text-white px-10 py-4 rounded-full hover:bg-brand-800 transition-colors">Submit Your Paper (Free) →</Link></div>
    </div>
  </main><Footer /></>)
}
