/* ============================================================
   PATHWISE — PROFILE PAGE
   ============================================================ */

(function(){
  if(!document.getElementById("profile-app")) return;
  if(!PWAuth.requireAuth()) return;

  async function init(){
    const user = PWAuth.currentUser();
    const userData = await PWStore.data.get();

    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-avatar").textContent = user.name.charAt(0).toUpperCase();

    if(userData.learningPath){
      document.getElementById("profile-path").textContent = userData.learningPath.pathName;
      document.getElementById("profile-progress-val").textContent =
        PWProgress.percentage(userData.learningPath.pathId, userData.progress) + "%";
    }else{
      document.getElementById("profile-path").textContent = "Not yet assessed";
      document.getElementById("profile-progress-val").textContent = "0%";
    }

    document.getElementById("profile-topics").textContent = userData.progress.completedTopics.length;
    document.getElementById("profile-projects").textContent = (userData.progress.completedProjects || []).length;
    document.getElementById("profile-streak").textContent = userData.progress.streak || 0;
    document.getElementById("profile-achievements").textContent =
      Object.values(userData.achievements).filter(Boolean).length + " / " + Object.keys(userData.achievements).length;

    document.getElementById("retake-assessment").addEventListener("click", ()=>{
      if(confirm("Retaking the assessment will generate a new recommended path. Your progress stays saved. Continue?")){
        window.location.href = "assessment.html";
      }
    });

    const themeRow = document.getElementById("theme-pref-row");
    themeRow.addEventListener("click", ()=> PWTheme.toggle());
  }

  init();
})();
