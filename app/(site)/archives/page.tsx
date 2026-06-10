'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, Download, BookOpen } from 'lucide-react'

const SUBJECTS = [
  'Arts & Humanities','Commerce & Management','Education',
  'Engineering & Technology','Environmental Science','Law',
  'Library Science','Literature & Linguistics','Mathematics',
  'Medical & Health Sciences','Political Science','Psychology',
  'Science','Social Science','Sociology','Other'
]

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

type Paper = {
  id: string; title: string; authorName: string; coAuthors?: string
  abstract: string; keywords: string; subject: string; doi?: string
  volume?: string; issue?: string; pageNo?: string; pdfUrl?: string
  institute: string; createdAt: number
}

export default function ArchivesPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [filtered, setFiltered] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/papers/published')
      .then(r => r.json())
      .then((d: unknown) => {
        const list = d as Paper[]
        setPapers(list)
        setFiltered(list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let r = papers
    if (subject !== 'all') r = r.filter(p => p.subject === subject)
    if (search) r = r.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authorName.toLowerCase().includes(search.toLowerCase()) ||
      p.keywords.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(r)
  }, [search, subject, papers])

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-brand-50">
        <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Published Archives</h1>
          <p className="font-body text-brand-200">{papers.length} papers published in Nrityanjali Journal</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, author, keywords..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-500 shadow-sm" />
            </div>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500 shadow-sm">
              <option value="all">All Subjects</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <p className="font-sans text-sm text-gray-500 mb-6">{filtered.length} paper{filtered.length !== 1 ? 's' : ''} found</p>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="font-display text-xl text-gray-400">No papers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(paper => (
                <div key={paper.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-sans text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">{paper.subject}</span>
                          {paper.volume && <span className="font-sans text-xs text-gray-400">Vol. {paper.volume}{paper.issue ? `, Issue ${paper.issue}` : ''}</span>}
                          {paper.doi && <span className="font-mono text-xs text-gray-400">DOI: {paper.doi}</span>}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-brand-900 leading-tight mb-2">{paper.title}</h3>
                        <p className="font-sans text-sm text-gray-600 mb-1">
                          {paper.authorName}{paper.coAuthors ? `, ${paper.coAuthors}` : ''}
                        </p>
                        <p className="font-sans text-xs text-gray-400">{paper.institute} · {formatDate(paper.createdAt)}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {paper.pdfUrl && (
                          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-sans text-xs font-semibold bg-brand-700 text-white px-4 py-2 rounded-xl hover:bg-brand-800 transition-colors">
                            <Download size={14} /> PDF
                          </a>
                        )}
                        <button onClick={() => setExpanded(expanded === paper.id ? null : paper.id)}
                          className="font-sans text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                          {expanded === paper.id ? 'Hide' : 'Abstract'}
                        </button>
                      </div>
                    </div>
                    {expanded === paper.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Abstract</h4>
                        <p className="font-body text-sm text-gray-700 leading-relaxed">{paper.abstract}</p>
                        {paper.keywords && (
                          <p className="font-sans text-xs text-gray-400 mt-3"><strong>Keywords:</strong> {paper.keywords}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
