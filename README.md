# RAG-builder

RAG-builder stitches together a FastAPI backend, a Lovable-built Vite/React frontend, and n8n workflows to deliver retrieval-augmented chatbots with authenticated, billable experiences. The frontend is connected to the backend using Codex.

## Features
- RAG builder: orchestrated retrieval/chat flows via FastAPI `chatbot` routes and n8n automation.
- Knowledge base uploader: import KBs through the provided n8n workflows for RAG chatbots.
- Auth & billing: JWT-based authentication with Google/GitHub social login hooks and Stripe-ready billing flows.
- Orchestration & workers: Celery workers/beat with Redis for task queues and Postgres for persistence; optional pgAdmin for DB inspection.
- Monitoring helpers: structured logging and rate limiting baked into the backend service.

## Tech Stack
- Frontend: Vite + React + TypeScript, Tailwind/shadcn UI; created with Lovable and connected to the backend using Codex.
- Backend: FastAPI, Celery, Redis, Postgres, pgAdmin, Stripe integration hooks, Google/GitHub OAuth.
- Automation: n8n (Docker) workflows stored as JSON exports in-repo.
- Tooling: Docker & Docker Compose for backend stack; npm for frontend; pytest for backend tests.

## Repository Structure
- `.github/workflows/ci.yml` � CI pipeline.
- `CHATful-backend/` � FastAPI app with Celery, Dockerfile, and `docker-compose.yml` (api/db/pgadmin/redis/celery/celery_beat).
  - `src/` � auth, billing, chatbot routers, Celery app, config.
  - `.env.example` � backend environment template.
- `CHATful-frontend/` � Vite React frontend (Lovable-generated) with Tailwind config and npm scripts.
- `N8N workflow/` � exported n8n workflows (`AI Agent Decision Maker - Last Version.json`, `Knowledge base uploader for RAG chatbot - Last Version.json`).
- `README.md` � this file.

## Prerequisites
- Docker and Docker Compose
- Node.js (18+) and npm
- Optional: `make` if you add local convenience targets

Copy and edit:
```bash
Copy-Item CHATful-backend/.env.example CHATful-backend/.env
# fill in required values
```

## Quick Start (fresh machine)
1) Create the Docker network expected by the backend compose file (only needed once):
```bash
docker network create appnet
```
2) Configure backend env:
```bash
Copy-Item CHATful-backend/.env.example CHATful-backend/.env
# open CHATful-backend/.env and set DB/JWT/SMTP/OAuth/Stripe/Redis values
```
3) Start backend stack (API, Postgres, pgAdmin, Redis, Celery):
```bash
docker compose -f CHATful-backend/docker-compose.yml up -d --build
```
4) Run n8n (default port 5678) and mount workflows:
```bash
# adjust the host path if you want workflows persisted elsewhere
# replace <HOST_PORT> if 5678 is occupied
docker run -d --name n8n -p 5678:5678 -v "${PWD}/N8N workflow":/home/node/workflows n8nio/n8n
```
5) Start the frontend locally:
```bash
cd CHATful-frontend
npm install
npm run dev
```
6) Open the app at the dev URL printed by Vite (commonly http://localhost:5173) and point it to the backend at `http://localhost:8000`.

## Running the stack
### Backend (Docker)
- Build & start: `docker compose -f CHATful-backend/docker-compose.yml up -d --build`
- Stop: `docker compose -f CHATful-backend/docker-compose.yml down`
- View logs: `docker compose -f CHATful-backend/docker-compose.yml logs -f api`
- Services: `api` (FastAPI on 8000), `db` (Postgres 5432), `pgadmin` (5050), `redis` (6379), `celery`, `celery_beat`
- Note: `appnet` network must exist (`docker network ls` to confirm).

### n8n (Docker)
- Start (detached, default 5678): `docker run -d --name n8n -p 5678:5678 -v "${PWD}/N8N workflow":/home/node/workflows n8nio/n8n`
- Stop/remove: `docker rm -f n8n`
- Access UI at `http://localhost:5678` (or your chosen host port).

### Frontend (npm)
```bash
cd CHATful-frontend
npm install
npm run dev
```
Use `npm run build` for production bundles and `npm run preview` to serve the built app locally.

## How the pieces connect
- Frontend (Vite/React, Lovable-built) ? Backend FastAPI (`api`): auth, chatbot, billing endpoints (CORS allows http://localhost:8080 by default).
- Backend ? Celery workers/beat via Redis for async jobs and scheduling.
- Backend/Celery ? Postgres for persistence; pgAdmin available at port 5050.
- Backend/Celery ? n8n via HTTP/webhooks to drive KB ingestion and decision flows.
- n8n workflows ? storage/backends (e.g., KB sources) and return responses consumed by the chatbot.

## n8n Workflows
- Stored in `N8N workflow/`:
  - `AI Agent Decision Maker - Last Version.json`
  - `Knowledge base uploader for RAG chatbot - Last Version.json`
- Import steps: open the n8n UI ? �Import from File� ? select the JSON export ? review credentials/environment variables used in webhook or HTTP Request nodes. Ensure any URLs align with `APP_URL` and that secrets (e.g., API keys, DB URLs) are available to the n8n container via its environment or mounted files.

## Scripts
- Frontend (`CHATful-frontend/package.json`):
  - `npm run dev` � start Vite dev server.
  - `npm run build` / `npm run build:dev` � production/development builds.
  - `npm run preview` � serve built assets locally.
  - `npm run lint` � lint codebase.
- Backend:
  - Docker Compose stack (api/db/redis/pgadmin/celery/celery_beat) via `docker compose -f CHATful-backend/docker-compose.yml ...`
  - Run tests locally (if needed): from `CHATful-backend`, `pip install -r requirements/requirements.txt` then `pytest`.

## Troubleshooting
- Port conflicts: ensure 8000 (API), 5432 (Postgres), 5050 (pgAdmin), 6379 (Redis), and 5678 (n8n) are free or remap host ports.
- Networking: if containers cannot talk, verify `appnet` exists; recreate with `docker network create appnet` and re-run compose.
- Env changes: update `CHATful-backend/.env`, then restart containers (`docker compose ... down` then `up -d --build`).
- Localhost vs container names: inside compose, services use their names (`db`, `redis`) not `localhost`.

## Contributing
Pull requests are welcome. Please align with existing linting/testing (frontend `npm run lint`, backend `pytest`) before submitting.

## License
No license file is present; add your chosen license before distribution.