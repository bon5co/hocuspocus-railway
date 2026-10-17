# hocuspocus-railway

Hocuspocus (Yjs realtime collaboration backend) packaged for Railway.

- Wraps `@hocuspocus/server` 4.7.1 with token auth, SQLite persistence and a health endpoint.
- Every WebSocket connection must present `HOCUSPOCUS_TOKEN` as its token.
- Documents persist in SQLite at `HOCUSPOCUS_DB` (default `/data/hocuspocus/db.sqlite`); mount a volume at `/data`.
- `GET /health` answers 200 with `{"status":"ok","documents":N}`.
- Listens on `$PORT` (default 8080).

Image: `ghcr.io/bon5co/hocuspocus-railway`, built by `.github/workflows/publish.yml`.
