import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
export default function GuidelinesPage() {
  const sections = [
    {title:'Manuscript Preparation',items:['Paper must be in MS Word format (.doc or .docx)','Font: Times New Roman, Size 12, Double spacing','Paper length: 3,000–8,000 words (including references)','Title: Bold, centered, font size 14','Abstract: 150–300 words followed by 4–6 keywords','Sections: Introduction, Literature Review, Methodology, Results, Discussion, Conclusion, References']},
    {title:'Author Information',items:['Full name of all authors (no abbreviations)','Designation, institution, department, country','Corresponding author email and phone','ORCID ID (optional but recommended)']},
    {title:'References',items:['Follow APA 7th Edition format','Minimum 10 references for research papers','All references must be cited in the text','Include DOI wherever available']},
    {title:'Tables & Figures',items:['Numbered sequentially (Table 1, Figure 1, etc.)','Title above tables, caption below figures','High resolution images (300 DPI minimum)','All figures must be original or properly cited']},
    {title:'Ethical Guidelines',items:['Paper must be original and unpublished','Not under review at another journal simultaneously','Authors must declare any conflict of interest','Plagiarism must be below 10% (excluding references)','Animal/human research must state ethical clearance']},
  ]
  return (<><Navbar /><main className="pt-16">
    <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center"><h1 className="font-display text-4xl font-bold text-white mb-3">Author Guidelines</h1><p className="font-body text-brand-200">Please read all guidelines carefully before submitting your paper</p></div>
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      {sections.map(s=><div key={s.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"><h2 className="font-display text-2xl font-semibold text-brand-900 mb-5">{s.title}</h2><ul className="space-y-3">{s.items.map(item=><li key={item} className="flex items-start gap-3 font-body text-sm text-gray-700"><CheckCircle size={16} className="text-brand-600 shrink-0 mt-0.5"/>{item}</li>)}</ul></div>)}
      <div className="text-center bg-brand-50 rounded-2xl p-8"><h3 className="font-display text-2xl font-bold text-brand-900 mb-3">Ready to Submit?</h3><Link href="/submit" className="inline-flex items-center gap-2 font-sans font-semibold bg-brand-700 text-white px-8 py-4 rounded-full hover:bg-brand-800 transition-colors">Submit Your Paper →</Link></div>
    </div>
  </main><Footer /></>)
}
