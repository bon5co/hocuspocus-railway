# Hocuspocus server for Railway.
# No official Hocuspocus image exists, so this wraps @hocuspocus/server with token auth,
# SQLite persistence on /data and a /health endpoint. Runs as root because Railway mounts
# volumes root-owned. Template variable is a ${{secret()}} so none publishes blank.
FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server.js ./
ENV NODE_ENV=production
CMD ["node", "server.js"]
