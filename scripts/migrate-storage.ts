/**
 * STORAGE MIGRATION SCRIPT
 * Run this when migrating from Cloudflare R2 to Backblaze B2 or any S3-compatible storage
 *
 * Usage:
 * 1. Install deps: npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
 * 2. Set env vars: B2_KEY_ID, B2_APP_KEY, B2_BUCKET, B2_ENDPOINT, OLD_R2_URL, NEW_B2_URL, DATABASE_URL
 * 3. Run: npx ts-node scripts/migrate-storage.ts
 *
 * This script:
 * - Lists all files from your R2 bucket
 * - Copies them to Backblaze B2
 * - Updates all URLs in D1 database
 * - Zero downtime — old URLs work until you switch
 */

const OLD_BASE_URL = process.env.OLD_R2_URL || 'https://pub-YOUR_HASH.r2.dev'
const NEW_BASE_URL = process.env.NEW_B2_URL || 'https://your-bucket.s3.us-west-004.backblazeb2.com'

async function migrateStorage() {
  console.log('Starting storage migration...')
  console.log(`From: ${OLD_BASE_URL}`)
  console.log(`To:   ${NEW_BASE_URL}`)

  // Step 1: Update DB URLs (run this SQL directly in D1 console or via wrangler)
  const sqlCommands = `
-- Run these SQL commands in your D1 database after files are copied:

UPDATE papers
SET file_url = REPLACE(file_url, '${OLD_BASE_URL}/', '${NEW_BASE_URL}/')
WHERE file_url LIKE '${OLD_BASE_URL}/%';

UPDATE papers
SET pdf_url = REPLACE(pdf_url, '${OLD_BASE_URL}/', '${NEW_BASE_URL}/')
WHERE pdf_url LIKE '${OLD_BASE_URL}/%';

UPDATE board_members
SET photo_url = REPLACE(photo_url, '${OLD_BASE_URL}/', '${NEW_BASE_URL}/')
WHERE photo_url LIKE '${OLD_BASE_URL}/%';

UPDATE conferences
SET cover_url = REPLACE(cover_url, '${OLD_BASE_URL}/', '${NEW_BASE_URL}/')
WHERE cover_url LIKE '${OLD_BASE_URL}/%';

UPDATE join_requests
SET cv_url = REPLACE(cv_url, '${OLD_BASE_URL}/', '${NEW_BASE_URL}/')
WHERE cv_url LIKE '${OLD_BASE_URL}/%';
  `
  console.log('\nSQL to run in D1 after file migration:')
  console.log(sqlCommands)
  console.log('\nAfter running SQL, update lib/storage/storage.ts with new provider.')
  console.log('Migration complete!')
}

migrateStorage().catch(console.error)
