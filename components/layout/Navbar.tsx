'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const mainNav = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Norms', href: '/norms' },
    {
      label: 'For Authors', href: '#',
      children: [
        { label: 'Guidelines', href: '/guidelines' },
        { label: 'Publication Charges', href: '/charges' },
        { label: 'FAQs', href: '/faqs' },
      ]
    },
    { label: 'Submit Papers', href: '/submit' },
    { label: 'Track Paper', href: '/track' },
    { label: 'Archives', href: '/archives' },
    {
      label: 'Board Committee', href: '#',
      children: [
        { label: 'Editorial Board', href: '/editorial-board' },
        { label: 'Advisory Board', href: '/advisory-board' },
        { label: 'Reviewer Committee', href: '/reviewer-committee' },
      ]
    },
    {
      label: 'Contact', href: '/contact',
      children: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Join as Editor / Reviewer', href: '/join' },
      ]
    },
    { label: 'Conference & Seminar', href: '/conference' },
  ]

  const isActive = (href: string) =>
    href !== '#' && (pathname === href || pathname.startsWith(href + '/'))

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-900 text-brand-200 text-xs font-sans py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>E-ISSN NO. - 3108-1452</span>
          <div className="flex items-center gap-6">
            <a href="tel:+919557475906" className="hover:text-white transition-colors">+91-9557475906</a>
            <a href="tel:+919568175906" className="hover:text-white transition-colors">+91-9568175906</a>
            <a href="mailto:info@Elsevierresearchjournal.com" className="hover:text-white transition-colors">info@Elsevierresearchjournal.com</a>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-white border-b border-brand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 bg-brand-800 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-brand-900 text-sm leading-tight">Elsevier</div>
                <div className="font-sans text-xs text-brand-600 leading-tight">Research Journal</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-0.5">
              {mainNav.map(item => (
                <div key={item.label} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className={`flex items-center gap-1 font-sans text-xs font-medium px-2.5 py-2 rounded-lg transition-all ${
                          item.children.some(c => isActive(c.href))
                            ? 'text-brand-700 bg-brand-50'
                            : 'text-gray-700 hover:text-brand-700 hover:bg-brand-50'
                        }`}
                      >
                        {item.label}
                        <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2.5 font-sans text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                              isActive(child.href)
                                ? 'text-brand-700 bg-brand-50 font-medium'
                                : 'text-gray-700 hover:text-brand-700 hover:bg-brand-50'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`font-sans text-xs font-medium px-2.5 py-2 rounded-lg transition-all ${
                        isActive(item.href)
                          ? 'text-brand-700 bg-brand-50'
                          : 'text-gray-700 hover:text-brand-700 hover:bg-brand-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Submit CTA + Mobile toggle */}
            <div className="flex items-center gap-2">
              <Link href="/submit" className="hidden sm:flex font-sans text-xs font-semibold bg-brand-700 text-white px-4 py-2 rounded-full hover:bg-brand-800 transition-colors">
                Submit Paper
              </Link>
              <button onClick={() => setOpen(!open)} className="xl:hidden p-2 text-gray-600 hover:text-brand-700">
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="xl:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
              {mainNav.map(item => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setDropdown(dropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between px-3 py-2.5 font-sans text-sm font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                      >
                        {item.label}
                        <ChevronDown size={14} className={`transition-transform ${dropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {dropdown === item.label && (
                        <div className="ml-4 space-y-0.5 mt-0.5">
                          {item.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block px-3 py-2 font-sans text-sm text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block px-3 py-2.5 font-sans text-sm font-medium rounded-lg transition-all ${
                        isActive(item.href)
                          ? 'text-brand-700 bg-brand-50'
                          : 'text-gray-700 hover:text-brand-700 hover:bg-brand-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Link href="/submit" onClick={() => setOpen(false)}
                  className="block w-full text-center font-sans text-sm font-semibold bg-brand-700 text-white px-5 py-3 rounded-xl hover:bg-brand-800 transition-colors">
                  Submit Paper
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

