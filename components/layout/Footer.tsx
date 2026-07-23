import Link from 'next/link'
import { BookOpen, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold">Elsevier</div>
              <div className="font-sans text-xs text-brand-300">Research Journal</div>
            </div>
          </div>
          <p className="font-sans text-xs text-brand-200 leading-relaxed mb-4">
            E-ISSN: 3108-1452 | Multidisciplinary peer-reviewed open access journal published by Elsevier India (OPC) Private Limited.
          </p>
          <div className="flex gap-3">
            {[
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Instagram, href: '#' },
              { icon: Youtube, href: '#' },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href} className="w-8 h-8 bg-brand-800 rounded-lg flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-sans font-semibold mb-4 text-brand-300 text-sm">Quick Links</h4>
          <ul className="space-y-2">
            {[
              ['/', 'Home'],
              ['/about', 'About Us'],
              ['/norms', 'Norms'],
              ['/submit', 'Submit Papers'],
              ['/track', 'Track Paper'],
              ['/archives', 'Archives'],
              ['/conference', 'Conference & Seminar'],
            ].map(([h, l]) => (
              <li key={h}>
                <Link href={h} className="font-sans text-xs text-brand-200 hover:text-white transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-semibold mb-4 text-brand-300 text-sm">For Authors</h4>
          <ul className="space-y-2">
            {[
              ['/guidelines', 'Author Guidelines'],
              ['/charges', 'Publication Charges'],
              ['/faqs', 'FAQs'],
              ['/editorial-board', 'Editorial Board'],
              ['/advisory-board', 'Advisory Board'],
              ['/reviewer-committee', 'Reviewer Committee'],
              ['/join', 'Join as Editor/Reviewer'],
            ].map(([h, l]) => (
              <li key={h}>
                <Link href={h} className="font-sans text-xs text-brand-200 hover:text-white transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-semibold mb-4 text-brand-300 text-sm">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin size={13} className="text-brand-400 mt-0.5 shrink-0" />
              <span className="font-sans text-xs text-brand-200 leading-relaxed">
                HOUSE No. B-168 S/F - 1, CHHATTARPUR PAHARI, SAWAN PUBLIC SCHOOL, SOUTH WEST DELHI -110074
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={13} className="text-brand-400 shrink-0" />
              <div className="flex flex-col gap-1">
                <a href="tel:+917302342998" className="font-sans text-xs text-brand-200 hover:text-white transition-colors">+91-7302342998</a>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={13} className="text-brand-400 shrink-0" />
              <a href="mailto:elsevierinternationalgroup@gmail.com" className="font-sans text-xs text-brand-200 hover:text-white transition-colors break-all">
                elsevierinternationalgroup@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-brand-400">
            (c) {new Date().getFullYear()} Elsevier India (OPC) Private Limited. All rights reserved.
          </p>
          <p className="font-sans text-xs text-brand-500">
            www.elsevierresearchjournal.com
          </p>
        </div>
      </div>
    </footer>
  )
}
