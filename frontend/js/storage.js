/* ============================================================
   PATHWISE — API CLIENT (formerly the localStorage layer)
   -----------------------------------------------------------
   This file used to simulate accounts/data with localStorage.
   It now talks to the real PathWise backend (FastAPI + MongoDB)
   over HTTP. The public shape (PWStore.users / .session / .data)
   is kept the same on purpose, so every other page controller
   only had to switch its calls to `await` instead of being
   rewritten from scratch.

   Auth: a JWT is issued by the backend on signup/login and kept
   in localStorage (pathwise_token) purely as a bearer credential
   sent on every request — no passwords or app data live in the
   browser anymore, the database is the single source of truth.
   ============================================================ */

const PWStore = (() => {
  const TOKEN_KEY = "pathwise_token";
  const USER_CACHE_KEY = "pathwise_user";

  function apiUrl(path) {
    const base = (window.PW_CONFIG && window.PW_CONFIG.API_BASE_URL) || "/api";
    return base.replace(/\/$/, "") + path;
  }

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
  function clearToken() { localStorage.removeItem(TOKEN_KEY); }

  function cacheUser(user) { localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user)); }
  function getCachedUser() {
    try { return JSON.parse(localStorage.getItem(USER_CACHE_KEY)); }
    catch (e) { return null; }
  }
  function clearCachedUser() { localStorage.removeItem(USER_CACHE_KEY); }

  async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (token) headers["Authorization"] = "Bearer " + token;

    let res;
    try {
      res = await fetch(apiUrl(path), { ...options, headers });
    } catch (e) {
      throw new Error("Could not reach the PathWise server. Check your connection and try again.");
    }

    let body = null;
    try { body = await res.json(); } catch (e) { /* empty/non-JSON body */ }

    if (res.status === 401) {
      // session expired / invalid token — clear it so requireAuth() sends the user back to login
      clearToken();
      clearCachedUser();
    }

    if (!res.ok) {
      const message = (body && body.detail) ? body.detail : "Something went wrong. Please try again.";
      throw new Error(message);
    }
    return body;
  }

  /* ---------------- users / auth ---------------- */
  const users = {
    async create({ name, email, password, education }) {
      try {
        const result = await apiFetch("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password, education })
        });
        setToken(result.token);
        cacheUser(result.user);
        return { ok: true, user: result.user };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },

    async verify(email, password) {
      try {
        const result = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        setToken(result.token);
        cacheUser(result.user);
        return { ok: true, user: result.user };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },

    async updateProfile(updates) {
      const user = await apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(updates) });
      cacheUser(user);
      return user;
    },

    /** Synchronous, cached copy of the signed-in user (name/email/education) for instant UI paint. */
    cached() { return getCachedUser(); }
  };

  /* ---------------- session ---------------- */
  const session = {
    isAuthed() { return !!getToken(); },
    /** Synchronous — returns the cached user's email, or null. */
    current() {
      const u = getCachedUser();
      return u ? u.email : null;
    },
    logout() {
      clearToken();
      clearCachedUser();
    }
  };

  /* ---------------- per-user app data (now backed by MongoDB) ---------------- */
  const data = {
    /** Returns { assessment, learningPath, progress, achievements } */
    async get() {
      return apiFetch("/userdata");
    },

    async saveAssessment(assessment) {
      const result = await apiFetch("/assessment", { method: "POST", body: JSON.stringify(assessment) });
      return result.assessment;
    },

    /** Computes + persists the recommended learning path from the saved assessment. */
    async generateRecommendation() {
      return apiFetch("/recommendation/generate", { method: "POST" });
    },

    async setCurrentTopic(topicId) {
      return apiFetch("/progress/set-current-topic", { method: "POST", body: JSON.stringify({ topicId }) });
    },

    /** Returns { progress, achievements, unlocked } */
    async completeTopic(topicId) {
      return apiFetch("/progress/complete-topic", { method: "POST", body: JSON.stringify({ topicId }) });
    },

    /** Returns { progress, achievements, unlocked } */
    async completeProject(projectName) {
      return apiFetch("/progress/complete-project", { method: "POST", body: JSON.stringify({ projectName }) });
    }
  };

  return { users, session, data };
})();
