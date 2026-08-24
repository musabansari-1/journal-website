import { NextResponse } from 'next/server'

const FALLBACK_CONFERENCES = [
  {
    id: 'conf-001',
    title: 'International Seminar on Research Methodology and Academic Publishing',
    description: 'An international seminar focused on modern research methodologies, ethical publishing practices, and navigating the academic publishing landscape. Topics include systematic literature review techniques, bibliometric analysis, plagiarism detection tools, DOI allocation processes, and open-access publishing models. Designed for early-career researchers, doctoral scholars, and faculty members.',
    venue: 'Online (Hybrid Mode)',
    date: 'October 2026',
    lastDate: 'September 15, 2026',
    registrationUrl: 'https://nrityanjaliresearchjournal.com/public/conference-seminar.php',
  },
  {
    id: 'conf-002',
    title: 'National Conference on Digital Transformation in Education and Research',
    description: 'A national conference examining the impact of digital technologies on education, research methodologies, and academic collaboration. Sessions cover AI in research, digital libraries, e-learning platforms, data analytics in education, and the future of multidisciplinary academic publishing in the digital age.',
    venue: 'Moradabad, Uttar Pradesh, India',
    date: 'December 2026',
    lastDate: 'November 10, 2026',
    registrationUrl: 'https://nrityanjaliresearchjournal.com/public/conference-seminar.php',
  },
  {
    id: 'conf-003',
    title: 'Viksit Bharat 2047: The Role of Bhartiya Gyan Parampara, Research & Publication',
    description: "A national conference exploring the role of traditional Indian knowledge systems (Bhartiya Gyan Parampara) in shaping India's vision for 2047. The conference brought together scholars, researchers, and educators to discuss how ancient Indian wisdom can inform modern research methodologies, publication practices, and academic frameworks for a developed India.",
    venue: 'Nrityanjali Multidisciplinary International Research Journal',
    date: 'March 2026',
    lastDate: 'February 28, 2026',
    registrationUrl: 'https://nrityanjaliresearchjournal.com/public/conference-seminar.php',
  },
]

export async function GET() {
  return NextResponse.json(FALLBACK_CONFERENCES)
}
