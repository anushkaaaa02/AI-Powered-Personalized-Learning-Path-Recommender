/* ============================================================
   PATHWISE — MISSION CONTROL (DASHBOARD)
   ============================================================ */

(function(){
  if(!document.getElementById("dash-app")) return;
  if(!PWAuth.requireAuth()) return;

  async function init(){
    const userData = await PWStore.data.get();

    if(!userData.learningPath){
      window.location.href = "assessment.html";
      return;
    }

    const pathId = userData.learningPath.pathId;
    const progress = userData.progress;
    const totalTopics = PWData.totalTopics(pathId);
    const pct = PWProgress.percentage(pathId, progress);

    document.getElementById("streak-count").textContent = progress.streak || 0;

    document.getElementById("stat-progress").textContent = pct + "%";
    document.getElementById("stat-progress-bar").style.width = pct + "%";
    document.getElementById("stat-topics").textContent = `${progress.completedTopics.length} / ${totalTopics}`;
    document.getElementById("stat-streak").textContent = (progress.streak || 0) + " Days";
    document.getElementById("stat-path").textContent = userData.learningPath.pathName;

    const topics = PWProgress.flatTopics(pathId);
    const currentTopic = topics.find(t => t.id === progress.currentTopic);

    if(currentTopic){
      document.getElementById("current-mission-name").textContent = currentTopic.name;
    }else{
      document.getElementById("current-mission-name").textContent = "All topics complete — explore projects!";
      document.getElementById("continue-btn").textContent = "VIEW PROJECTS →";
      document.getElementById("continue-btn").href = "projects.html";
    }

    /* ---------------- winding road journey tracker ---------------- */
    const roadWrap = document.getElementById("road-wrap");
    const roadStats = PWRoad.render(roadWrap, {
      topics,
      progress,
      phases: PWData.ROADMAPS[pathId]
    });
    document.getElementById("road-badge").textContent = `${roadStats.completedCount} / ${roadStats.total} MISSIONS`;
    document.getElementById("road-pct").textContent = roadStats.percentage + "%";
    document.getElementById("road-fill").style.width = roadStats.percentage + "%";

    /* ---------------- upcoming missions ---------------- */
    const upcoming = topics.filter(t => !progress.completedTopics.includes(t.id) && t.id !== progress.currentTopic).slice(0,4);
    const upEl = document.getElementById("upcoming-grid");
    if(upcoming.length === 0){
      upEl.innerHTML = `<p style="color:var(--text-secondary)">No upcoming missions — you're at the end of the roadmap.</p>`;
    }else{
      upcoming.forEach((t,i)=>{
        const card = document.createElement("a");
        card.className = "up-card";
        card.href = "roadmap.html";
        card.innerHTML = `<div class="up-num">${String(i+1).padStart(2,"0")}</div><h4>${t.name}</h4>`;
        upEl.appendChild(card);
      });
    }

    /* ---------------- achievements ---------------- */
    const achEl = document.getElementById("ach-grid");
    Object.entries(PWData.ACHIEVEMENTS).forEach(([key,a])=>{
      const unlocked = userData.achievements[key];
      const card = document.createElement("div");
      card.className = "ach-card " + (unlocked ? "unlocked" : "locked");
      card.innerHTML = `<div class="ach-icon">${a.icon}</div><h4>${a.name}</h4><p>${a.desc}</p>`;
      achEl.appendChild(card);
    });
  }

  init();
})();
