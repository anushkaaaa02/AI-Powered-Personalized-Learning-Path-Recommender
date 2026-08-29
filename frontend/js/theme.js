/* ============================================================
   PATHWISE — THEME ENGINE
   Handles dark/light mode, persisted in localStorage.
   ============================================================ */

const PWTheme = (() => {
  const KEY = "pathwise_theme";

  function apply(theme){
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-icon]").forEach(el=>{
      el.textContent = theme === "dark" ? "🌙" : "☀";
    });
  }

  function get(){
    return localStorage.getItem(KEY) || "dark";
  }

  function set(theme){
    localStorage.setItem(KEY, theme);
    apply(theme);
  }

  function toggle(){
    const next = get() === "dark" ? "light" : "dark";
    set(next);
  }

  function init(){
    apply(get());
    document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
      btn.addEventListener("click", toggle);
    });
  }

  return { init, toggle, set, get };
})();

document.addEventListener("DOMContentLoaded", PWTheme.init);
