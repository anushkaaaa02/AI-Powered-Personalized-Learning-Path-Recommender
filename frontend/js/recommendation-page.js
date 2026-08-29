/* ============================================================
   PATHWISE — RECOMMENDATION REVEAL PAGE
   ============================================================ */

(function(){
  if(!document.getElementById("rec-app")) return;
  if(!PWAuth.requireAuth()) return;

  async function init(){
    const userData = await PWStore.data.get();
    const lp = userData.learningPath;

    if(!lp){
      window.location.href = "assessment.html";
      return;
    }

    document.getElementById("rec-path-name").textContent = lp.pathName;
    document.getElementById("rec-duration").textContent = lp.duration;

    // match ring (circular progress via svg stroke-dashoffset)
    const pct = lp.matchPercentage;
    const circle = document.getElementById("match-circle");
    const R = 54;
    const C = 2 * Math.PI * R;
    circle.style.strokeDasharray = C;
    circle.style.strokeDashoffset = C;
    document.getElementById("match-pct").textContent = pct + "%";
    requestAnimationFrame(()=>{
      circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.16,.8,.24,1)";
      circle.style.strokeDashoffset = C - (C * pct/100);
    });

    const whyList = document.getElementById("why-list");
    lp.reasons.forEach(r=>{
      const li = document.createElement("li");
      li.textContent = r;
      whyList.appendChild(li);
    });

    const skillsWrap = document.getElementById("rec-skills");
    PWData.CAREER_PATHS[lp.pathId].skills.forEach(s=>{
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = s;
      skillsWrap.appendChild(chip);
    });

    const altGrid = document.getElementById("alt-grid");
    lp.alternatives.forEach(a=>{
      const card = document.createElement("div");
      card.className = "alt-card";
      card.innerHTML = `<h4>${a.name}</h4><span class="alt-pct">${a.percentage}% MATCH</span>`;
      altGrid.appendChild(card);
    });

    document.getElementById("unlock-btn").addEventListener("click", async ()=>{
      // set first topic as current if not already set
      const roadmap = PWData.ROADMAPS[lp.pathId];
      if(!userData.progress.currentTopic){
        const firstTopic = roadmap[0].topics[0];
        await PWStore.data.setCurrentTopic(firstTopic.id);
      }
      window.location.href = "dashboard.html";
    });

    document.getElementById("explore-btn").addEventListener("click", ()=>{
      window.location.href = "index.html#paths";
    });
  }

  init();
})();
