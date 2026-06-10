import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Nrityanjali Multidisciplinary International Research Journal',
  description: 'E-ISSN: 3108-1452 | Submit your research papers for peer-reviewed publication. Open access journal covering all disciplines.',
  keywords: 'research journal, publish research paper, peer review, open access, multidisciplinary journal India',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
