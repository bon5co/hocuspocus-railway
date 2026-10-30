# hocuspocus-railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/hocuspocus-or-just-updated-yjs-collabora?referralCode=Z1xivh&utm_medium=integration&utm_source=template&utm_campaign=generic)

**Deploy on Railway:** [Hocuspocus template](https://railway.com/deploy/hocuspocus-or-just-updated-yjs-collabora?referralCode=Z1xivh&utm_medium=integration&utm_source=template&utm_campaign=generic)

Hocuspocus (Yjs realtime collaboration backend) packaged for Railway.

- Wraps `@hocuspocus/server` 4.7.1 with token auth, SQLite persistence and a health endpoint.
- Every WebSocket connection must present `HOCUSPOCUS_TOKEN` as its token.
- Documents persist in SQLite at `HOCUSPOCUS_DB` (default `/data/hocuspocus/db.sqlite`); mount a volume at `/data`.
- `GET /health` answers 200 with `{"status":"ok","documents":N}`.
- Listens on `$PORT` (default 8080).

Image: `ghcr.io/bon5co/hocuspocus-railway`, built by `.github/workflows/publish.yml`.
