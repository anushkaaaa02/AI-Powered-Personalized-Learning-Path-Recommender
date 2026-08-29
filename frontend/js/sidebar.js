/* ============================================================
   PATHWISE — SIDEBAR TOGGLE (mobile)
   ============================================================ */

(function(){
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("sidebar-open");
  if(!sidebar || !overlay || !openBtn) return;

  function open(){ sidebar.classList.add("open"); overlay.classList.add("show"); }
  function close(){ sidebar.classList.remove("open"); overlay.classList.remove("show"); }

  openBtn.addEventListener("click", open);
  overlay.addEventListener("click", close);
  sidebar.querySelectorAll(".sidebar-link").forEach(a => a.addEventListener("click", close));
})();
