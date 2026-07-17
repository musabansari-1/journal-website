'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Phone, Mail, MapPin, CheckCircle, Loader } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/contact'), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (res.ok) setSuccess(true)
    } catch {}
    setLoading(false)
  }

  return (
    <><Navbar /><main className="pt-16">
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-3">Contact Us</h1>
        <p className="font-body text-brand-200">We're here to help with your publication queries</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">Get in Touch</h2>
            {[{icon:Phone,label:'Phone',value:'+91-9557475906',href:'tel:+919557475906'},
              {icon:Mail,label:'Email',value:'info@Elsevierresearchjournal.com',href:'mailto:info@Elsevierresearchjournal.com'},
              {icon:MapPin,label:'Address',value:'Rampur, Uttar Pradesh 244924, India',href:null},
            ].map(item=>(
              <div key={item.label} className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0"><item.icon size={18} className="text-brand-700"/></div>
                <div><p className="font-sans text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  {item.href ? <a href={item.href} className="font-sans text-sm text-brand-700 hover:text-brand-900">{item.value}</a> : <p className="font-sans text-sm text-gray-700">{item.value}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle size={40} className="text-green-600"/></div>
              <h3 className="font-display text-3xl font-bold text-brand-900 mb-3">Message Sent!</h3>
              <p className="font-sans text-gray-600">We'll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[['name','Full Name','text'],['email','Email','email'],['phone','Phone','tel'],['subject','Subject','text']].map(([k,l,t])=>(
                  <div key={k}><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">{l} *</label>
                    <input required type={t} value={form[k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500"/></div>
                ))}
              </div>
              <div><label className="font-sans text-sm font-medium text-gray-700 mb-1.5 block">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-500 resize-none"/></div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 font-sans font-semibold bg-brand-700 text-white py-4 rounded-xl hover:bg-brand-800 disabled:opacity-50 transition-colors">
                {loading ? <><Loader size={16} className="animate-spin"/>Sending...</> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main><Footer /></>
  )
}

