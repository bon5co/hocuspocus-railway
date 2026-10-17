// Hocuspocus (Yjs realtime collaboration backend) for Railway.
// Persistence: SQLite on the /data volume via node:sqlite (no native modules).
// Auth: every WebSocket connection must present HOCUSPOCUS_TOKEN as its token.
// Health: GET /health answers 200 JSON.
import { Server } from '@hocuspocus/server'
import * as Y from 'yjs'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const token = process.env.HOCUSPOCUS_TOKEN
if (!token) {
  console.error('HOCUSPOCUS_TOKEN is required')
  process.exit(1)
}
const dbPath = process.env.HOCUSPOCUS_DB || '/data/hocuspocus/db.sqlite'
mkdirSync(dirname(dbPath), { recursive: true })
const db = new DatabaseSync(dbPath)
db.exec('PRAGMA journal_mode=WAL')
db.exec('CREATE TABLE IF NOT EXISTS documents (name TEXT PRIMARY KEY, data BLOB NOT NULL, updated_at INTEGER NOT NULL)')
const getStmt = db.prepare('SELECT data FROM documents WHERE name = ?')
const putStmt = db.prepare('INSERT INTO documents (name, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(name) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at')
const countStmt = db.prepare('SELECT COUNT(*) AS n FROM documents')

const port = Number(process.env.PORT || 8080)

const server = new Server({
  port,
  address: '0.0.0.0',
  quiet: true,
  async onAuthenticate({ token: presented }) {
    if (presented !== token) throw new Error('unauthorized')
  },
  async onLoadDocument({ documentName }) {
    const row = getStmt.get(documentName)
    return row ? new Uint8Array(row.data) : null
  },
  async onStoreDocument({ documentName, document }) {
    putStmt.run(documentName, Y.encodeStateAsUpdate(document), Date.now())
  },
  async onRequest({ request, response }) {
    if (request.url === '/health' || request.url === '/health/') {
      const body = JSON.stringify({ status: 'ok', documents: countStmt.get().n })
      response.writeHead(200, { 'content-type': 'application/json' })
      response.end(body)
      throw null // handled; stop other hooks / default response
    }
  },
})

await server.listen()
console.log(`hocuspocus listening on :${port}, db ${dbPath}`)
