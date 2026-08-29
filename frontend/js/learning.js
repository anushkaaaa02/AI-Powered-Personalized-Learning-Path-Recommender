/* ============================================================
   PATHWISE — LEARNING MODULE PAGE
   ============================================================ */

(function(){
  if(!document.getElementById("learning-app")) return;
  if(!PWAuth.requireAuth()) return;

  let userData, pathId, topics, topicId, idx;

  function lessonCount(seed){
    // deterministic pseudo lesson count 5-9 based on topic id, purely for display
    let h = 0; for(const c of seed) h += c.charCodeAt(0);
    return 5 + (h % 5);
  }

  function render(){
    const topic = topics[idx];
    topicId = topic.id;
    const state = PWProgress.topicState(topic.id, userData.progress, pathId);
    const total = lessonCount(topic.id);
    const done = state === "completed" ? total : state === "current" ? Math.min(total-1, Math.floor(total*0.4)) : 0;

    document.getElementById("learn-title").textContent = topic.name;
    document.getElementById("learn-progress-txt").textContent = `${done} / ${total} Lessons Completed`;

    document.getElementById("acc-overview").querySelector(".acc-body-in").textContent =
      `This mission covers ${topic.name}, part of ${topic.phase} on your ${userData.learningPath.pathName} roadmap. Work through the material below, then mark this mission complete to unlock the next one.`;

    document.getElementById("acc-learn").querySelector(".acc-body-in").innerHTML =
      `<ul style="padding-left:18px;display:flex;flex-direction:column;gap:6px;">
        <li>Core concepts behind ${topic.name}</li>
        <li>Common real-world use cases</li>
        <li>Hands-on practice patterns</li>
        <li>Mistakes beginners often make</li>
      </ul>`;

    document.getElementById("acc-resources").querySelector(".acc-body-in").innerHTML =
      `<ul style="padding-left:18px;display:flex;flex-direction:column;gap:6px;">
        <li>Guided reading — ${topic.name} fundamentals</li>
        <li>Short video walkthrough</li>
        <li>Reference cheat sheet</li>
      </ul>`;

    document.getElementById("acc-practice").querySelector(".acc-body-in").textContent =
      `Complete ${Math.max(3, total-2)} short exercises applying ${topic.name} before moving on.`;

    document.getElementById("acc-project").querySelector(".acc-body-in").textContent =
      `Mini project: apply ${topic.name} in a small, self-contained build to lock in what you learned.`;

    const completeBtn = document.getElementById("complete-btn");
    completeBtn.textContent = state === "completed" ? "COMPLETED ✓" : "MARK AS COMPLETE ✓";
    completeBtn.disabled = state === "completed";

    const prevBtn = document.getElementById("prev-topic-btn");
    const nextBtn = document.getElementById("next-topic-btn");
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === topics.length - 1 || PWProgress.topicState(topics[idx+1].id, userData.progress, pathId) === "locked";

    history.replaceState(null, "", `learning.html?topic=${topic.id}`);
  }

  function showAchievementToast(key){
    const a = PWData.ACHIEVEMENTS[key];
    const toast = document.getElementById("toast");
    toast.textContent = `${a.icon} Achievement unlocked: ${a.name}`;
    toast.classList.add("show");
    setTimeout(()=> toast.classList.remove("show"), 3200);
  }

  async function init(){
    userData = await PWStore.data.get();
    if(!userData.learningPath){ window.location.href = "assessment.html"; return; }

    pathId = userData.learningPath.pathId;
    topics = PWProgress.flatTopics(pathId);

    const params = new URLSearchParams(window.location.search);
    topicId = params.get("topic") || userData.progress.currentTopic || (topics[0] && topics[0].id);
    idx = topics.findIndex(t => t.id === topicId);
    if(idx === -1) idx = 0;

    document.querySelectorAll(".acc-head").forEach(head=>{
      head.addEventListener("click", ()=> head.closest(".acc").classList.toggle("open"));
    });

    document.getElementById("complete-btn").addEventListener("click", async ()=>{
      const completeBtn = document.getElementById("complete-btn");
      completeBtn.disabled = true;
      try{
        const result = await PWStore.data.completeTopic(topicId);
        userData.progress = result.progress;
        userData.achievements = result.achievements;
        if(result.unlocked.length){
          showAchievementToast(result.unlocked[0]);
        }
        render();
      }catch(e){
        completeBtn.disabled = false;
        alert(e.message || "Could not save your progress. Please try again.");
      }
    });

    document.getElementById("prev-topic-btn").addEventListener("click", ()=>{
      if(idx > 0){ idx--; render(); }
    });
    document.getElementById("next-topic-btn").addEventListener("click", ()=>{
      if(idx < topics.length - 1){ idx++; render(); }
    });

    render();
  }

  init();
})();
