/* ============================================================
   PATHWISE — RUNTIME CONFIG
   -----------------------------------------------------------
   Set the base URL of the FastAPI backend here.

   - Local dev (backend run directly with uvicorn on :8000,
     frontend opened separately / via a static server):
       API_BASE_URL: "http://localhost:8000/api"

   - Docker Compose / production, where nginx serves the
     frontend and proxies "/api" to the backend container
     (see frontend/nginx.conf):
       API_BASE_URL: "/api"
   ============================================================ */
window.PW_CONFIG = {
  // Default assumes nginx (see docker-compose.yml) proxies /api to the backend.
  // Running the backend directly with uvicorn and opening this folder with a
  // plain static file server? Point this at the backend instead, e.g.:
  //   API_BASE_URL: "http://localhost:8000/api"
  API_BASE_URL: "/api"
};
