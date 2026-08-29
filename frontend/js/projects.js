/* ============================================================
   PATHWISE — PROJECTS PAGE
   ============================================================ */

(function(){
  const grid = document.getElementById("proj-grid");
  if(!grid) return;

  const tabs = document.querySelectorAll(".proj-tab");
  let active = "beginner";

  function render(){
    grid.innerHTML = "";
    PWData.PROJECTS[active].forEach(p=>{
      const card = document.createElement("div");
      card.className = "proj-card";
      card.innerHTML = `
        <span class="proj-diff ${active}">${active.toUpperCase()}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="skill-chips">${p.skills.map(s=>`<span class="chip">${s}</span>`).join("")}</div>
        <div class="proj-meta"><span>⏱ ${p.time}</span></div>
        <button class="btn btn-ghost btn-sm btn-block" style="margin-top:16px;" data-view>VIEW PROJECT DETAILS →</button>
      `;
      card.querySelector("[data-view]").addEventListener("click", ()=>{
        alert(`${p.name}\n\nSkills: ${p.skills.join(", ")}\nEstimated time: ${p.time}\n\n${p.desc}`);
      });
      grid.appendChild(card);
    });
  }

  tabs.forEach(tab=>{
    tab.addEventListener("click", ()=>{
      tabs.forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      active = tab.dataset.filter;
      render();
    });
  });

  render();
})();
