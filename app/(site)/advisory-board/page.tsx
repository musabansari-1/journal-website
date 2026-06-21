'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Users } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

type Member = { id: string; name: string; designation: string; institute: string; country: string; expertise?: string; photoUrl?: string }

export default function BoardPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(apiUrl('/api/members/advisory'))
      .then(r => r.json())
      .then((d: unknown) => { setMembers(d as Member[]); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <><Navbar /><main className="pt-16">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Advisory Board</h1>
        <p className="font-body text-brand-200">Distinguished scholars guiding our publication standards</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-display text-xl text-gray-400">Members will be listed soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {m.photoUrl
                      ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                      : <span className="font-display font-bold text-brand-700 text-xl">{m.name[0]}</span>}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-brand-900">{m.name}</h3>
                    <p className="font-sans text-xs text-brand-600">{m.designation}</p>
                  </div>
                </div>
                <p className="font-sans text-sm text-gray-600 mb-1">{m.institute}</p>
                <p className="font-sans text-xs text-gray-400">{m.country}</p>
                {m.expertise && (
                  <p className="font-sans text-xs text-brand-500 mt-2 bg-brand-50 px-3 py-1 rounded-full inline-block">{m.expertise}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main><Footer /></>
  )
}
