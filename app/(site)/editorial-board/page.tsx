'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Users, Mail, Globe, BookOpen, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

type Member = {
  id: string; name: string; designation: string; institute: string
  country: string; expertise?: string; photoUrl?: string; email?: string
  type: string; displayOrder?: number; profileUrl?: string
}

const ROLE_TABS = [
  { key: 'all', label: 'All Members' },
  { key: 'chief', label: 'Editor-in-Chief' },
  { key: 'editorial', label: 'Editorial Board Member' },
  { key: 'advisory', label: 'Advisory Board' },
  { key: 'reviewer', label: 'Reviewer Committee' },
]

const FALLBACK_MEMBERS: Member[] = [
  // Editor-in-Chief
  { id: '1', name: 'Dr. Anamika Bharti', designation: 'Assistant Professor', institute: 'Department of Education', country: 'India', expertise: 'Education', type: 'chief', email: 'bhaeranamika08@gmail.com' },
  // Editorial Board
  { id: '2', name: 'Dr. H.L.Neel Wasantha', designation: 'Professor', institute: 'Department of Management Science, Uva Wellassa University in Sri Lanka', country: 'Sri Lanka', expertise: 'Other', type: 'editorial', email: 'neel@uwu.ac.lk' },
  { id: '3', name: 'Prof Kanhaiya Jha', designation: 'Professor', institute: 'Department of Mathematics, School of Science, Kathmandu University, Nepal', country: 'Nepal', expertise: 'Other', type: 'editorial', email: 'jhakn@ku.edu.np' },
  { id: '4', name: 'Prof. (Dr) D.M.R. Dissanayake', designation: 'Professor', institute: 'Department of Marketing Management, University of Kelaniya, Sri Lanka', country: 'Sri Lanka', expertise: 'Other', type: 'editorial', email: 'ravi@kln.ac.lk' },
  { id: '5', name: 'Dr. Rajeev Chaudhary', designation: 'Dean', institute: 'Vivek Law College, Vivek University, Bijnor, Uttar Pradesh', country: 'India', expertise: 'Other', type: 'editorial', email: 'Deanlaw@vivekuniversity.ac.in' },
  { id: '6', name: 'Professor Gaurav Rao', designation: 'Professor', institute: 'Department of Education (CIE), Faculty of Education, University of Delhi', country: 'India', expertise: 'Other', type: 'editorial', email: 'grao@cie.du.ac.in' },
  { id: '7', name: 'Dr. Mohan Lal Arya', designation: 'Professor', institute: 'School of Education and Humanities, IFTM University, Lodhipur Rajput Delhi Road, Moradabad', country: 'India', expertise: 'Education', type: 'editorial', email: 'drmlarya@iftmuniversity.ac.in' },
  { id: '8', name: 'Dr. Yogendra Singh', designation: 'Professor', institute: 'School of Law, IFTM University, Lodhipur Rajput, Moradabad', country: 'India', expertise: 'Other', type: 'editorial', email: 'yogendra_singh@iftmuniversity.ac.in' },
  // Reviewer
  { id: '11', name: 'Dr. Mahesh Kumar Arya', designation: 'Assistant Professor & M.A., M.Ed., M.Phil, Ph.D.', institute: 'Dr. B.R.A University, Agra', country: 'India', expertise: 'Education', type: 'reviewer', email: 'rudraarya1411@gmail.com' },
]

const ROLE_LABELS: Record<string, string> = {
  chief: 'Editor-in-Chief',
  editorial: 'Editorial Board Member',
  advisory: 'Advisory Board',
  reviewer: 'Reviewer Committee',
}

const ROLE_COLORS: Record<string, string> = {
  chief: 'bg-purple-100 text-purple-700 border-purple-200',
  editorial: 'bg-brand-100 text-brand-700 border-brand-200',
  advisory: 'bg-amber-100 text-amber-700 border-amber-200',
  reviewer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

export default function BoardPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetch(apiUrl('/api/members/editorial'))
      .then(r => r.json())
      .then((d: unknown) => { const data = d as Member[]; setMembers(data.length > 0 ? data : FALLBACK_MEMBERS); setLoading(false) })
      .catch(() => { setMembers(FALLBACK_MEMBERS); setLoading(false) })
  }, [])

  const filtered = activeTab === 'all' ? members : members.filter(m => m.type === activeTab)
  const grouped = ROLE_TABS.filter(t => t.key !== 'all').map(tab => ({
    ...tab,
    members: members.filter(m => m.type === tab.key),
  })).filter(g => g.members.length > 0)

  return (
    <><Navbar /><main className="pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Editorial Board & Committee Members</h1>
        <p className="font-body text-brand-200">Distinguished scholars guiding our publication standards</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
          {ROLE_TABS.map(tab => {
            const count = tab.key === 'all' ? members.length : members.filter(m => m.type === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-700 text-white shadow-md'
                    : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                }`}
              >
                {tab.label} <span className="ml-1 text-xs opacity-70">({count})</span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : activeTab === 'all' ? (
          /* Grouped view — all tabs */
          <div className="space-y-12">
            {grouped.map(group => (
              <div key={group.key}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-display text-xl font-bold text-brand-900">{group.label}</h2>
                  <span className="font-sans text-xs font-semibold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">{group.members.length} Member{group.members.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.members.map(m => <MemberCard key={m.id} member={m} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered view */
          <>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-bold text-brand-900">{ROLE_LABELS[activeTab] || activeTab}</h2>
              <span className="font-sans text-xs font-semibold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">{filtered.length} Member{filtered.length > 1 ? 's' : ''}</span>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="font-display text-xl text-gray-400 mb-2">No Committee Members Found</p>
                <p className="font-sans text-sm text-gray-400">There are currently no active members listed under this specific role position.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(m => <MemberCard key={m.id} member={m} />)}
              </div>
            )}
          </>
        )}
      </div>
    </main><Footer /></>
  )
}

function MemberCard({ member: m }: { member: Member }) {
  const [expanded, setExpanded] = useState(false)
  const colorClass = ROLE_COLORS[m.type] || 'bg-brand-100 text-brand-700 border-brand-200'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all overflow-hidden">
      <div className="p-6">
        {/* Role badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`font-sans text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${colorClass}`}>
            {ROLE_LABELS[m.type] || m.type}
          </span>
          {m.expertise && (
            <span className="font-sans text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{m.expertise}</span>
          )}
        </div>

        {/* Photo + Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-brand-200">
            {m.photoUrl
              ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
              : <span className="font-display font-bold text-brand-700 text-xl">{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-brand-900 text-base leading-tight">{m.name}</h3>
            <p className="font-sans text-sm text-brand-600 font-medium">{m.designation}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <BookOpen size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="font-sans text-sm text-gray-600 leading-snug">{m.institute}</p>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-gray-400 shrink-0" />
            <p className="font-sans text-xs text-gray-400">{m.country}</p>
          </div>
          {m.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400 shrink-0" />
              <a href={`mailto:${m.email}`} className="font-sans text-xs text-brand-600 hover:text-brand-800 truncate transition-colors">{m.email}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
