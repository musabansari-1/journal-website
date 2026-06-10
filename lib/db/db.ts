/**
 * DATABASE CONNECTION — Drizzle ORM abstraction
 *
 * TO SWAP DATABASE change only this file:
 *
 * Neon Postgres (10GB free):
 *   import { drizzle } from 'drizzle-orm/neon-http'
 *   import { neon } from '@neondatabase/serverless'
 *   const sql = neon(process.env.DATABASE_URL!)
 *   export const createDb = () => drizzle(sql)
 *
 * Turso (9GB free SQLite):
 *   import { drizzle } from 'drizzle-orm/libsql'
 *   import { createClient } from '@libsql/client'
 *   const client = createClient({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN! })
 *   export const createDb = () => drizzle(client)
 *
 * Supabase:
 *   import { drizzle } from 'drizzle-orm/postgres-js'
 *   import postgres from 'postgres'
 *   const client = postgres(process.env.DATABASE_URL!)
 *   export const createDb = () => drizzle(client)
 */

import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export type DbEnv = { DB: D1Database }
export const createDb = (env: DbEnv) => drizzle(env.DB, { schema })
export type Database = ReturnType<typeof createDb>
