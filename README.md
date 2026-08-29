# PathWise — AI-Powered Personalized Learning Path Recommender

A full-stack learning-path recommender: a rule-based recommendation engine
maps a learner's interests, existing skills, experience level and goals to
a ranked career path, then generates a structured phase-by-phase roadmap
with progress tracking, streaks and achievements.

```
PathWise-Fullstack/
├── backend/     FastAPI + MongoDB REST API
├── frontend/    Static HTML/CSS/JS UI (no build step)
└── docker-compose.yml
```

## Architecture

- **Frontend** — vanilla HTML/CSS/JS. `js/storage.js` is a thin API client
  (fetch + JWT bearer token) that every page controller calls; the shape
  was kept identical to the original localStorage prototype so the UI code
  changed as little as possible.
- **Backend** — FastAPI, async MongoDB access via Motor, JWT auth
  (python-jose), bcrypt password hashing (passlib).
- **Database** — MongoDB, one `users` collection. Each user document holds
  their profile, assessment answers, recommended learning path, progress
  (completed topics/projects, streak) and unlocked achievements.
- **Recommendation engine** — a deterministic scoring function
  (`backend/app/recommendation.py`), a direct Python port of the original
  frontend prototype's rules, kept as a pure function of
  `assessment -> ranked paths` so it can be swapped for a trained ML model
  later without touching any route or the frontend contract.

## Backend API

| Method | Route                             | Auth | Description |
|--------|------------------------------------|------|--------------|
| POST   | `/api/auth/signup`                 | –    | Create account, returns JWT |
| POST   | `/api/auth/login`                  | –    | Login, returns JWT |
| GET    | `/api/auth/me`                     | ✅   | Current user |
| PUT    | `/api/auth/profile`                | ✅   | Update name/education |
| GET    | `/api/userdata`                    | ✅   | Assessment, learning path, progress, achievements |
| POST   | `/api/assessment`                  | ✅   | Save the 5-question career assessment |
| POST   | `/api/recommendation/generate`     | ✅   | Score + persist the recommended path |
| POST   | `/api/progress/complete-topic`     | ✅   | Mark a roadmap topic complete, bumps streak/achievements |
| POST   | `/api/progress/complete-project`   | ✅   | Mark a project complete |
| POST   | `/api/progress/set-current-topic`  | ✅   | Set the active roadmap topic |
| GET    | `/api/content/paths`               | –    | All career paths |
| GET    | `/api/content/roadmap/{pathId}`    | –    | Roadmap for a path |
| GET    | `/api/content/projects`            | –    | Practice project catalog |
| GET    | `/api/content/achievements`        | –    | Achievement catalog |

Interactive docs are auto-generated at `/docs` (Swagger) and `/redoc`.

## Run locally with Docker (recommended)

Requires Docker + Docker Compose.

```bash
cd PathWise-Fullstack
cp backend/.env.example backend/.env    # edit JWT_SECRET at minimum
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend:  http://localhost:8000/docs
- MongoDB:  localhost:27017

The bundled `frontend/nginx.conf` proxies `/api/*` to the backend
container, and `frontend/js/config.js` already defaults to
`API_BASE_URL: "/api"` to match — no changes needed for the Docker setup.

## Run locally without Docker

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # point MONGO_URI at a local or Atlas MongoDB
uvicorn app.main:app --reload --port 8000
```
Needs a MongoDB instance — either run one locally (`docker run -p 27017:27017 mongo:7`)
or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and put
its connection string in `MONGO_URI`.

**Frontend**
Leave `frontend/js/config.js` pointed at `http://localhost:8000/api` (the
default) and open the site with any static file server, e.g.:
```bash
cd frontend
python -m http.server 5500
```
Visit http://localhost:5500.

## Deploying

- **Backend** — deploy `backend/` as a container (Render, Railway, Fly.io,
  AWS/GCP/Azure). Set `MONGO_URI` to a MongoDB Atlas connection string,
  `JWT_SECRET` to a long random value, and `CORS_ORIGINS` to your deployed
  frontend's origin.
- **Frontend** — deploy `frontend/` as a static site (Netlify, Vercel,
  GitHub Pages, S3+CloudFront, or the provided nginx container). Update
  `js/config.js`'s `API_BASE_URL` to your backend's public URL (or `/api`
  if you proxy it through the same domain).
- **Database** — a free MongoDB Atlas M0 cluster is enough to demo this
  project end to end.

## Security notes

- Passwords are hashed with bcrypt (never stored or logged in plaintext).
- Auth uses short-lived, signed JWTs (`JWT_SECRET` must be changed from the
  default before any real deployment).
- All write endpoints require a valid bearer token; ownership is enforced
  server-side (a user can only ever read/modify their own document).
