/**
 * STORAGE ABSTRACTION LAYER
 * TO SWAP STORAGE — only change this file
 *
 * Backblaze B2: use @aws-sdk/client-s3 with B2 endpoint
 * AWS S3: use @aws-sdk/client-s3 with AWS endpoint
 * Migration script: scripts/migrate-storage.ts
 */
export type StorageEnv = { R2: R2Bucket }

export async function uploadFile(env: StorageEnv, key: string, buffer: ArrayBuffer, contentType: string): Promise<string> {
  await env.R2.put(key, buffer, { httpMetadata: { contentType } })
  return `https://pub-YOUR_JOURNAL_R2_HASH.r2.dev/${key}`
}

export async function deleteFile(env: StorageEnv, key: string): Promise<void> {
  await env.R2.delete(key)
}

export function generateStorageKey(folder: string, filename: string): string {
  const ext = filename.split('.').pop()
  return `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
}

export function validateFile(contentType: string, sizeBytes: number, type: 'document' | 'image'): { valid: boolean; error?: string } {
  if (type === 'document') {
    const allowed = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text', 'application/pdf']
    if (!allowed.includes(contentType)) return { valid: false, error: 'Only .doc, .docx, .odt, .pdf files allowed' }
    if (sizeBytes > 20 * 1024 * 1024) return { valid: false, error: 'File size must be under 20MB' }
  } else {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) return { valid: false, error: 'Only JPEG, PNG, WebP allowed' }
    if (sizeBytes > 5 * 1024 * 1024) return { valid: false, error: 'Image must be under 5MB' }
  }
  return { valid: true }
}
