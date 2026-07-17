import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
export default function NormsPage() {
  return (<><Navbar /><main className="pt-16">
    <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center"><h1 className="font-display text-4xl font-bold text-white mb-3">Publication Norms</h1><p className="font-body text-brand-200">Standards and norms for publication in Elsevier Research Journal</p></div>
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      {[{t:'Scope and Coverage',c:'Elsevier Multidisciplinary International Research Journal (E-ISSN: 3108-1452) accepts original research papers, review articles, case studies, and short communications from all academic disciplines including but not limited to Sciences, Social Sciences, Humanities, Engineering, Law, Management, and Education.'},
        {t:'Review Process',c:'All submitted manuscripts undergo double-blind peer review. The identity of authors and reviewers is kept confidential. The editorial board makes final decisions based on reviewer recommendations, originality, and academic merit.'},
        {t:'Originality and Plagiarism',c:'All submissions must be original work not published elsewhere or under consideration at another journal. Plagiarism check is mandatory. Papers with similarity index above 10% (excluding references and bibliography) will be rejected.'},
        {t:'Copyright',c:'Authors retain copyright of their work. By submitting, authors grant Elsevier Journal the right to publish and distribute the paper. The journal publishes under Creative Commons Attribution 4.0 International License (CC BY 4.0).'},
        {t:'Publication Timeline',c:'Initial review and acknowledgment: within 24 hours. Peer review completion: 2–5 working days. Revision period (if applicable): 7 days. Final acceptance to publication: 3–5 working days.'},
        {t:'Withdrawal Policy',c:'Authors may withdraw their paper before acceptance at no charge. After acceptance and payment of publication fee, withdrawal is not permitted. In exceptional cases, a formal withdrawal request must be submitted with justification.'},
      ].map(s=><div key={s.t} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"><h2 className="font-display text-xl font-semibold text-brand-900 mb-4">{s.t}</h2><p className="font-body text-gray-700 leading-relaxed">{s.c}</p></div>)}
    </div>
  </main><Footer /></>)
}

