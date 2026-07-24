import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight, BookOpen, Globe, Award, Users } from 'lucide-react'
export default function AboutPage() {
  return (<><Navbar /><main className="pt-16">
    <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-20 text-center">
      <h1 className="font-display text-5xl font-bold text-white mb-4">About the Journal</h1>
      <p className="font-body text-brand-200 text-lg max-w-2xl mx-auto">Elsevier Multidisciplinary International Research Journal — peer-reviewed, open access, globally accessible.</p>
    </div>
    <section className="py-20 bg-white max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div><h2 className="font-display text-3xl font-bold text-brand-900 mb-4">About the Journal</h2><p className="font-body text-gray-700 leading-relaxed mb-4">Elsevier Multidisciplinary International Research Journal is a peer-reviewed, open-access journal published by Elsevier India (OPC) Private Limited.</p><p className="font-body text-gray-700 leading-relaxed">We are committed to promoting original research, critical reviews, and scholarly contributions across all academic disciplines.</p></div>
        <div className="grid grid-cols-2 gap-4">{[['Founded','2024'],['Access','Open Access'],['Review','Double Blind Peer Review'],['Scope','Multidisciplinary']].map(([k,v])=><div key={k} className="bg-brand-50 rounded-2xl p-5 text-center"><div className="font-sans text-xs text-brand-500 mb-1">{k}</div><div className="font-display text-lg font-bold text-brand-900">{v}</div></div>)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[{icon:BookOpen,title:'Mission',desc:'To provide a platform for researchers, academicians, and professionals to share knowledge and advance human understanding across disciplines.'},
          {icon:Globe,title:'Vision',desc:'To be a globally recognized research journal that fosters innovation, scholarly exchange, and academic excellence.'},
          {icon:Award,title:'Publication Ethics',desc:'We strictly follow COPE guidelines. All submissions are checked for plagiarism and undergo rigorous double-blind peer review.'},
          {icon:Users,title:'Scope',desc:'We welcome papers from all disciplines including sciences, humanities, social sciences, engineering, management, law, and more.'}
        ].map(item=><div key={item.title} className="p-8 rounded-2xl border border-gray-100 hover:border-brand-200 transition-all"><div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4"><item.icon size={22} className="text-brand-700"/></div><h3 className="font-display text-xl font-semibold text-brand-900 mb-3">{item.title}</h3><p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p></div>)}
      </div>
      <div className="mt-12 text-center"><Link href="/submit" className="inline-flex items-center gap-2 font-sans font-semibold bg-brand-700 text-white px-10 py-4 rounded-full hover:bg-brand-800 transition-colors">Submit Your Paper <ArrowRight size={18}/></Link></div>
    </section>
  </main><Footer /></>)
}

