/* ============================================================
   PATHWISE — PROFILE ANALYSIS ANIMATION CONTROLLER
   Runs a staged "analyzing" animation, then asks the backend to
   compute + persist the recommendation for the recommendation page.
   ============================================================ */

(function(){
  if(!document.getElementById("analysis-app")) return;
  if(!PWAuth.requireAuth()) return;

  const pctEl = document.getElementById("analysis-pct");
  const listEl = document.getElementById("analysis-list");
  const statusEl = document.getElementById("analysis-status");

  const items = [
    "INTERESTS ANALYZED",
    "SKILLS ANALYZED",
    "EXPERIENCE LEVEL ANALYZED",
    "CAREER GOALS ANALYZED",
    "LEARNING AVAILABILITY ANALYZED"
  ];

  items.forEach((label,i)=>{
    const row = document.createElement("div");
    row.className = "analysis-item";
    row.id = "ai-" + i;
    row.innerHTML = `<span class="mark">○</span><span>${label}</span>`;
    listEl.appendChild(row);
  });

  async function init(){
    const userData = await PWStore.data.get();
    if(!userData.assessment){
      window.location.href = "assessment.html";
      return;
    }
    runAnimation();
  }

  function runAnimation(){
    let pct = 0;
    let itemIdx = 0;
    const timer = setInterval(()=>{
      pct += Math.floor(6 + Math.random()*10);
      if(pct >= 100) pct = 100;
      pctEl.textContent = pct + "%";

      const shouldUnlock = Math.floor(pct / (100/items.length));
      while(itemIdx < shouldUnlock && itemIdx < items.length){
        const row = document.getElementById("ai-" + itemIdx);
        row.classList.add("done");
        row.querySelector(".mark").textContent = "✓";
        itemIdx++;
      }

      if(pct >= 100){
        clearInterval(timer);
        statusEl.textContent = "MATCHING WITH YOUR PROFILE...";
        finish();
      }
    }, 380);
  }

  async function finish(){
    try{
      await PWStore.data.generateRecommendation();
      statusEl.textContent = "MATCH FOUND. REDIRECTING...";
      setTimeout(()=>{ window.location.href = "recommendation.html"; }, 1100);
    }catch(e){
      statusEl.textContent = e.message || "Something went wrong. Please try again.";
    }
  }

  init();
})();
