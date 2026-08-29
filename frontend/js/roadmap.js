/* ============================================================
   PATHWISE — ROADMAP PAGE
   ============================================================ */

(function(){
  if(!document.getElementById("roadmap-app")) return;
  if(!PWAuth.requireAuth()) return;

  async function init(){
    const userData = await PWStore.data.get();

    if(!userData.learningPath){
      window.location.href = "assessment.html";
      return;
    }

    const pathId = userData.learningPath.pathId;
    const progress = userData.progress;
    const roadmap = PWData.ROADMAPS[pathId];

    document.getElementById("roadmap-path-name").textContent = userData.learningPath.pathName + " ROADMAP";

    const wrap = document.getElementById("roadmap-phases");
    roadmap.forEach(phase=>{
      const phaseEl = document.createElement("div");
      phaseEl.className = "phase";
      phaseEl.innerHTML = `<div class="phase-tag">${phase.phase}</div><h2>${phase.title}</h2>`;

      phase.topics.forEach(t=>{
        const state = PWProgress.topicState(t.id, progress, pathId);
        const row = document.createElement("div");
        row.className = "topic-row " + state;
        const label = state === "completed" ? "COMPLETED" : state === "current" ? "IN PROGRESS" : "LOCKED";
        row.innerHTML = `
          <span class="topic-name">${t.name}</span>
          <span class="topic-state ${state}">${label}</span>
        `;
        if(state !== "locked"){
          row.style.cursor = "pointer";
          row.addEventListener("click", ()=> window.location.href = `learning.html?topic=${t.id}`);
        }
        phaseEl.appendChild(row);
      });
      wrap.appendChild(phaseEl);
    });
  }

  init();
})();
