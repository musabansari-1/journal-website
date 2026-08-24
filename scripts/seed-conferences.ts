/**
 * Seed conferences from the reference site into D1.
 * Run: npx tsx scripts/seed-conferences.ts
 * Requires wrangler to be configured with the correct D1 database.
 */

import { execSync } from 'child_process'

const conferences = [
  {
    id: 'conf-001',
    title: 'International Seminar on Research Methodology and Academic Publishing',
    description: 'An international seminar focused on modern research methodologies, ethical publishing practices, and navigating the academic publishing landscape. Topics include systematic literature review techniques, bibliometric analysis, plagiarism detection tools, DOI allocation processes, and open-access publishing models. Designed for early-career researchers, doctoral scholars, and faculty members.',
    venue: 'Online (Hybrid Mode)',
    date: 'October 2026',
    lastDate: 'September 15, 2026',
    registrationUrl: 'https://nrityanjaliresearchjournal.com/public/conference-seminar.php',
    createdAt: Date.now(),
  },
  {
    id: 'conf-002',
    title: 'National Conference on Digital Transformation in Education and Research',
    description: 'A national conference examining the impact of digital technologies on education, research methodologies, and academic collaboration. Sessions cover AI in research, digital libraries, e-learning platforms, data analytics in education, and the future of multidisciplinary academic publishing in the digital age.',
    venue: 'Moradabad, Uttar Pradesh, India',
    date: 'December 2026',
    lastDate: 'November 10, 2026',
    registrationUrl: 'https://nrityanjaliresearchjournal.com/public/conference-seminar.php',
    createdAt: Date.now(),
  },
  {
    id: 'conf-003',
    title: 'Viksit Bharat 2047: The Role of Bhartiya Gyan Parampara, Research & Publication',
    description: "A national conference exploring the role of traditional Indian knowledge systems (Bhartiya Gyan Parampara) in shaping India's vision for 2047. The conference brought together scholars, researchers, and educators to discuss how ancient Indian wisdom can inform modern research methodologies, publication practices, and academic frameworks for a developed India.",
    venue: 'Nrityanjali Multidisciplinary International Research Journal',
    date: 'March 2026',
    lastDate: 'February 28, 2026',
    registrationUrl: 'https://nrityanjaliresearchjournal.com/public/conference-seminar.php',
    createdAt: Date.now(),
  },
]

function escape(s: string) { return s.replace(/'/g, "''") }

for (const conf of conferences) {
  const sql = `INSERT OR REPLACE INTO conferences (id, title, description, venue, date, last_date, registration_url, is_active, created_at) VALUES ('${conf.id}', '${escape(conf.title)}', '${escape(conf.description)}', '${escape(conf.venue)}', '${conf.date}', '${conf.lastDate}', '${conf.registrationUrl}', 1, ${conf.createdAt});`

  console.log(`Seeding: ${conf.title}`)
  execSync(`npx wrangler d1 execute journal-db --remote --command "${sql}"`, { stdio: 'inherit' })
}

console.log('\nDone! Conference seeded successfully.')
