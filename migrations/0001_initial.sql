CREATE TABLE IF NOT EXISTS papers (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, abstract TEXT NOT NULL,
  keywords TEXT NOT NULL, subject TEXT NOT NULL, author_name TEXT NOT NULL,
  co_authors TEXT, designation TEXT NOT NULL, institute TEXT NOT NULL,
  email TEXT NOT NULL, phone TEXT NOT NULL, country TEXT NOT NULL DEFAULT 'India',
  file_url TEXT, file_key TEXT, file_name TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  reviewer_notes TEXT, admin_notes TEXT,
  publication_fee INTEGER, payment_id TEXT, payment_link_id TEXT,
  payment_link_url TEXT, payment_status TEXT DEFAULT 'not_required',
  paid_at INTEGER, doi TEXT, volume TEXT, issue TEXT,
  page_no TEXT, pdf_url TEXT, pdf_key TEXT,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS board_members (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, designation TEXT NOT NULL,
  institute TEXT NOT NULL, country TEXT NOT NULL DEFAULT 'India',
  expertise TEXT, photo_url TEXT, photo_key TEXT,
  type TEXT NOT NULL, display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1, created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS conferences (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
  venue TEXT NOT NULL, date TEXT NOT NULL, last_date TEXT,
  registration_url TEXT, cover_url TEXT, cover_key TEXT,
  is_active INTEGER DEFAULT 1, created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS join_requests (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
  phone TEXT NOT NULL, designation TEXT NOT NULL, institute TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India', expertise TEXT NOT NULL,
  experience TEXT, type TEXT NOT NULL, cv_url TEXT, cv_key TEXT,
  status TEXT DEFAULT 'pending', is_read INTEGER DEFAULT 0, created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
  phone TEXT, subject TEXT NOT NULL, message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0, created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY, author_name TEXT NOT NULL, designation TEXT NOT NULL,
  institute TEXT NOT NULL, content TEXT NOT NULL, rating INTEGER DEFAULT 5,
  photo_url TEXT, is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_papers_status ON papers(status);
CREATE INDEX IF NOT EXISTS idx_papers_email ON papers(email);
CREATE INDEX IF NOT EXISTS idx_papers_subject ON papers(subject, status);
CREATE INDEX IF NOT EXISTS idx_members_type ON board_members(type, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(is_read, created_at);
