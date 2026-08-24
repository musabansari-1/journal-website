# Elsevier Multidisciplinary International Research Journal

## Stack
Same as Addition Publishing House — completely separate Cloudflare resources, same account.

- **Frontend**: Next.js 15 → Cloudflare Pages (free, unlimited bandwidth)
- **Backend**: Cloudflare Workers — `journal-worker` (separate from publishing worker)
- **Database**: Cloudflare D1 — `journal-db` (separate 500MB free)
- **Storage**: Cloudflare R2 — `journal-r2` (separate bucket)
- **Cache**: Cloudflare KV — `journal-kv` (separate namespace, reduces D1 reads 95%)
- **Queue**: Cloudflare Queues — `journal-queue` (separate queue)
- **Auth (Admin)**: Cloudflare Access (Google login, free)
- **Payments**: Razorpay Payment Links (sent after acceptance, no checkout page)
- **Email**: Resend (3000/month free)
- **ORM**: Drizzle ORM (swap DB with 1 file change: lib/db/db.ts)
- **Storage abstraction**: lib/storage/storage.ts (swap storage with 1 file change)

## Why Separate Resources on Same Account
- Workers: each gets own 100k req/day free (not shared)
- Pages: each gets unlimited bandwidth (not shared)
- D1: each database gets own 500MB (reads/writes ARE shared at 5M/day)
- R2: storage IS shared (10GB total) — separate buckets for cleanliness
- KV: reads ARE shared (100k/day) — KV caching reduces D1 reads by ~95%
- Queues: messages ARE shared (5M/month) — combined usage is tiny

When you upgrade Workers to $5/month — BOTH sites get unlimited D1 reads/writes.

## Payment Flow (Journal-specific)
Unlike a store (immediate payment), journal payments happen AFTER acceptance:

```
1. Author submits paper (FREE)
2. Admin reviews → sets status + reviewer notes
3. Admin accepts → sets publication fee in admin panel
4. Admin clicks "Send Payment Link"
5. Worker creates Razorpay Payment Link
6. Author receives email/SMS with payment link (Razorpay sends automatically)
7. Author clicks link → pays on Razorpay-hosted page (no custom checkout)
8. Razorpay webhook → Worker marks paper as payment_received
9. Admin uploads final PDF → publishes paper with DOI
10. Paper appears in public Archives
```

## Paper Status Workflow
```
submitted → under_review → revision_required → accepted
→ payment_pending → payment_received → published
                                     → rejected (at any stage)
```

## KV Caching Strategy
Published papers, board members, conferences, testimonials are cached in KV.
- KV reads do NOT count against shared D1 limits
- Cache TTL: papers=5min, members=1hr, conferences=10min
- Cache is invalidated automatically when admin updates data
- Paper tracking always reads fresh from D1 (authors need real status)

## Project Structure
```
elsevier-journal/
├── app/
│   ├── (site)/
│   │   ├── page.tsx              # Home
│   │   ├── about/                # About the journal
│   │   ├── submit/               # Paper submission with file upload
│   │   ├── track/                # Track paper by name + email
│   │   ├── archives/             # Published papers with search/filter
│   │   ├── editorial-board/      # Editorial board members
│   │   ├── advisory-board/       # Advisory board members
│   │   ├── reviewer-committee/   # Reviewer committee
│   │   ├── conference/           # Conferences & seminars
│   │   ├── join/                 # Join as editor/reviewer
│   │   ├── contact/              # Contact form
│   │   ├── guidelines/           # Author guidelines
│   │   ├── norms/                # Publication norms
│   │   ├── charges/              # Publication charges
│   │   └── faqs/                 # FAQs accordion
│   ├── admin/                    # Protected by Cloudflare Access
│   │   ├── page.tsx              # Dashboard with stats
│   │   ├── papers/               # All submissions + status management
│   │   ├── archives/             # Publish papers + upload PDFs
│   │   ├── members/              # Board member management
│   │   ├── conferences/          # Conference/seminar management
│   │   └── contacts/             # Contact + join request inbox
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── db/
│   │   ├── db.ts                 # ← Only file to change when swapping DB
│   │   ├── schema.ts             # D1 schema
│   │   └── queries/              # papers, members, conferences, contacts
│   ├── storage/
│   │   ├── storage.ts            # ← Only file to change when swapping storage
│   │   └── kv-cache.ts           # KV caching to reduce D1 reads
│   ├── email/                    # Resend + templates
│   ├── razorpay/                 # Payment link creation + webhook verify
│   └── utils/id.ts               # Helpers, subject list, status maps
├── workers/index.ts              # Full API + Queue consumer
├── migrations/0001_initial.sql   # D1 schema migration
├── scripts/migrate-storage.ts   # Storage migration helper
└── wrangler.toml                 # journal-worker config
```

## Setup (Step by Step)

### Step 1 — Cloudflare Resources (run in terminal)
```bash
npm install -g wrangler
wrangler login

# D1 database (separate from publishing site)
wrangler d1 create journal-db
# → Copy database_id to wrangler.toml

# R2 bucket
wrangler r2 bucket create journal-r2
wrangler r2 bucket cors put journal-r2 --rules '[{"allowedOrigins":["*"],"allowedMethods":["GET"],"maxAgeSeconds":3600}]'

# KV namespace
wrangler kv namespace create journal-kv
# → Copy id to wrangler.toml

# Queue
wrangler queues create journal-queue

# Run migration
wrangler d1 migrations apply journal-db
```

### Step 2 — R2 Public Access
1. Cloudflare Dashboard → R2 → journal-r2 → Settings → Public Access → Enable
2. Copy the public URL (e.g. `https://pub-abc123.r2.dev`)
3. Update `lib/storage/storage.ts` line: `return \`https://pub-YOUR_HASH.r2.dev/\${key}\``

### Step 3 — Cloudflare Access (Admin Auth)
1. Cloudflare Zero Trust → Access → Applications → Add Application
2. Type: Self-hosted
3. URL: `your-journal-domain.com/admin*`
4. Add Google as identity provider
5. Policy: allow your admin email only
6. This protects all `/admin/*` routes with zero code

### Step 4 — Environment Variables
In Cloudflare Workers dashboard → Settings → Variables & Secrets:
```
RAZORPAY_KEY_ID         = rzp_live_xxx
RAZORPAY_KEY_SECRET     = xxx
RAZORPAY_WEBHOOK_SECRET = xxx (from Razorpay webhook settings)
RESEND_API_KEY          = re_xxx
```

### Step 5 — Razorpay Webhook
In Razorpay Dashboard → Webhooks → Add New:
- URL: `https://journal-worker.your-subdomain.workers.dev/api/payment/webhook`
- Events: `payment_link.paid`
- Copy the webhook secret → add to Workers env as `RAZORPAY_WEBHOOK_SECRET`

### Step 6 — Deploy
```bash
# Deploy Worker
wrangler deploy

# Build and deploy Pages
npm run build
wrangler pages deploy .next --project-name=elsevier-journal
```

## Swapping Database
Only change `lib/db/db.ts`:

**To Neon Postgres (10GB free):**
```typescript
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
export const createDb = () => drizzle(sql)
```

**To Turso (9GB free SQLite):**
```typescript
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
const client = createClient({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN! })
export const createDb = () => drizzle(client)
```

## Swapping Storage
Only change `lib/storage/storage.ts`. See script in `scripts/migrate-storage.ts` for data migration.

## Monthly Costs — Both Sites Combined
| Phase | Cost |
|-------|------|
| Launch (both sites, free tier) | ₹0/month |
| Upgrade (Workers paid $5/month) | ₹400/month covers BOTH sites |
| R2 beyond 10GB | ₹1.25/GB |
| Razorpay | ~2% per transaction only |

## Admin Panel Routes (all protected by Cloudflare Access)
- `/admin` — Dashboard: submission stats, recent papers
- `/admin/papers` — All submissions, status updates, payment link sending
- `/admin/archives` — Publish accepted papers, upload PDFs, assign DOIs
- `/admin/members` — Add/remove editorial, advisory, reviewer board members
- `/admin/conferences` — Manage conference and seminar listings
- `/admin/contacts` — Contact inquiries + editor/reviewer applications


