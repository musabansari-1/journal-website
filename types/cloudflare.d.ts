export {}
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
    exec(query: string): Promise<D1ExecResult>
    dump(): Promise<ArrayBuffer>
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement
    first<T = unknown>(colName?: string): Promise<T | null>
    run<T = unknown>(): Promise<D1Result<T>>
    all<T = unknown>(): Promise<D1Result<T>>
    raw<T = unknown>(): Promise<T[]>
  }
  interface D1Result<T = unknown> {
    results: T[]
    success: boolean
    error?: string
    meta: object
  }
  interface D1ExecResult { count: number; duration: number }
  interface R2Bucket {
    put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: { httpMetadata?: { contentType?: string } }): Promise<R2Object>
    get(key: string): Promise<R2ObjectBody | null>
    delete(keys: string | string[]): Promise<void>
    list(options?: object): Promise<{ objects: R2Object[]; truncated: boolean; cursor?: string }>
    head(key: string): Promise<R2Object | null>
  }
  interface R2Object {
    key: string; version: string; size: number; etag: string
    uploaded: Date; httpMetadata?: { contentType?: string }
  }
  interface R2ObjectBody extends R2Object {
    body: ReadableStream; bodyUsed: boolean
    arrayBuffer(): Promise<ArrayBuffer>
    text(): Promise<string>
    json<T>(): Promise<T>
  }
  interface KVNamespace {
    get(key: string, options?: { type?: 'text' }): Promise<string | null>
    get(key: string, options: { type: 'json' }): Promise<unknown>
    put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: { expiration?: number; expirationTtl?: number }): Promise<void>
    delete(key: string): Promise<void>
    list(options?: { limit?: number; prefix?: string; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>
  }
  interface Queue {
    send(message: unknown, options?: { contentType?: string; delaySeconds?: number }): Promise<void>
  }
  interface MessageBatch<Body = unknown> {
    queue: string
    messages: Message<Body>[]
    ackAll(): void
    retryAll(): void
  }
  interface Message<Body = unknown> {
    readonly id: string
    readonly timestamp: Date
    readonly body: Body
    readonly attempts: number
    ack(): void
    retry(): void
  }
}
