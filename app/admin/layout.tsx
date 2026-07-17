'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Users, Archive, Calendar, MessageSquare, LayoutDashboard, BookOpen, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  const nav = [
    { href:'/admin', label:'Dashboard', icon:LayoutDashboard },
    { href:'/admin/papers', label:'Papers', icon:FileText },
    { href:'/admin/archives', label:'Published', icon:Archive },
    { href:'/admin/members', label:'Board Members', icon:Users },
    { href:'/admin/conferences', label:'Conferences', icon:Calendar },
    { href:'/admin/contacts', label:'Contacts & Joins', icon:MessageSquare },
  ]
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-900 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
        <div className="p-5 border-b border-brand-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><BookOpen size={16} className="text-white"/></div>
            <div><div className="font-display text-sm font-bold text-white">Elsevier</div><div className="font-sans text-xs text-brand-400">Admin Panel</div></div>
          </div>
        </div>
        <nav className="p-3 space-y-0.5">
          {nav.map(item => {
            const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm font-medium transition-all ${active ? 'bg-brand-600 text-white' : 'text-brand-300 hover:text-white hover:bg-brand-800'}`}>
                <item.icon size={17}/>{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-5 left-3 right-3">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-brand-400 hover:text-white hover:bg-brand-800 transition-all">
            <LogOut size={17}/> Back to Site
          </Link>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={()=>setOpen(false)}/>}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={()=>setOpen(true)} className="lg:hidden text-gray-500"><span className="sr-only">Menu</span>☰</button>
          <span className="font-sans font-semibold text-gray-800">{nav.find(i=>i.href===path||(i.href!=='/admin'&&path.startsWith(i.href)))?.label||'Dashboard'}</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

