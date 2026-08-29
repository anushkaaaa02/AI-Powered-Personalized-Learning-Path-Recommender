/* ============================================================
   PATHWISE — CAREER ASSESSMENT CONTROLLER
   5-step wizard. Saves results to the backend via the API.
   ============================================================ */

(function(){
  if(!document.getElementById("assessment-app")) return;
  if(!PWAuth.requireAuth()) return;

  const QUESTIONS = [
    {
      id:"interests", title:"WHAT CAPTURES YOUR ATTENTION?", type:"multi",
      options:[
        {v:"web", l:"Web Development"},
        {v:"ai", l:"Artificial Intelligence"},
        {v:"data", l:"Data & Analytics"},
        {v:"cyber", l:"Cybersecurity"},
        {v:"mobile", l:"Mobile Development"},
        {v:"uiux", l:"UI/UX Design"}
      ]
    },
    {
      id:"skills", title:"WHAT SKILLS DO YOU ALREADY HAVE?", type:"multi",
      options:[
        {v:"html", l:"HTML"},{v:"css", l:"CSS"},{v:"javascript", l:"JavaScript"},
        {v:"java", l:"Java"},{v:"python", l:"Python"},{v:"sql", l:"SQL"},
        {v:"c", l:"C / C++"},{v:"linux", l:"Linux"},{v:"git", l:"Git"},
        {v:"none", l:"I am just starting"}
      ]
    },
    {
      id:"experience", title:"SELECT YOUR EXPERIENCE LEVEL.", type:"single",
      options:[
        {v:"beginner", l:"Beginner", d:"I am starting my technology journey."},
        {v:"intermediate", l:"Intermediate", d:"I understand some concepts and want to improve."},
        {v:"advanced", l:"Advanced", d:"I want to specialize and build advanced projects."}
      ]
    },
    {
      id:"goal", title:"WHAT IS YOUR PRIMARY GOAL?", type:"single",
      options:[
        {v:"job", l:"Get a Job"},
        {v:"projects", l:"Build Projects"},
        {v:"skills", l:"Improve My Skills"},
        {v:"explore", l:"Explore Career Options"}
      ]
    },
    {
      id:"studyTime", title:"HOW MUCH TIME CAN YOU LEARN EACH DAY?", type:"single",
      options:[
        {v:"30min", l:"30 Minutes"},
        {v:"1hr", l:"1 Hour"},
        {v:"2hr", l:"2 Hours"},
        {v:"2plus", l:"2+ Hours"}
      ]
    }
  ];

  let step = 0;
  const answers = { interests:[], skills:[], experience:null, goal:null, studyTime:null };

  const titleEl = document.getElementById("q-title");
  const optsEl = document.getElementById("q-options");
  const countEl = document.getElementById("q-count");
  const fillEl = document.getElementById("progress-fill");
  const prevBtn = document.getElementById("q-prev");
  const nextBtn = document.getElementById("q-next");

  function render(){
    const q = QUESTIONS[step];
    titleEl.textContent = q.title;
    countEl.textContent = `QUESTION ${String(step+1).padStart(2,"0")} / ${String(QUESTIONS.length).padStart(2,"0")}`;
    fillEl.style.width = (((step+1)/QUESTIONS.length)*100) + "%";
    optsEl.className = "q-options" + (q.type === "single" ? " " : "") ;
    optsEl.parentElement.classList.toggle("q-single", q.type === "single");
    optsEl.innerHTML = "";

    q.options.forEach(opt=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "q-option";
      const selected = q.type === "multi" ? answers[q.id].includes(opt.v) : answers[q.id] === opt.v;
      if(selected) btn.classList.add("selected");
      btn.innerHTML = `<span>${opt.l}</span>` + (opt.d ? `<small>${opt.d}</small>` : "") + `<span class="tick">${selected?"✓":""}</span>`;
      btn.addEventListener("click", ()=>{
        if(q.type === "multi"){
          const idx = answers[q.id].indexOf(opt.v);
          if(idx > -1) answers[q.id].splice(idx,1); else answers[q.id].push(opt.v);
        }else{
          answers[q.id] = opt.v;
        }
        render();
      });
      optsEl.appendChild(btn);
    });

    prevBtn.style.visibility = step === 0 ? "hidden" : "visible";
    nextBtn.textContent = step === QUESTIONS.length - 1 ? "ANALYZE MY PROFILE →" : "NEXT →";
    nextBtn.disabled = !isAnswered(q);
  }

  function isAnswered(q){
    if(q.type === "multi") return answers[q.id].length > 0;
    return !!answers[q.id];
  }

  prevBtn.addEventListener("click", ()=>{ if(step>0){ step--; render(); } });
  nextBtn.addEventListener("click", ()=>{
    if(!isAnswered(QUESTIONS[step])) return;
    if(step < QUESTIONS.length - 1){
      step++;
      render();
    }else{
      submit();
    }
  });

  async function submit(){
    nextBtn.disabled = true;
    nextBtn.textContent = "ANALYZING...";
    // clean up mutually-exclusive "just starting" skill entry
    const skills = answers.skills.includes("none") ? [] : answers.skills;
    const assessment = { ...answers, skills };
    try{
      await PWStore.data.saveAssessment(assessment);
      window.location.href = "analysis.html";
    }catch(e){
      nextBtn.disabled = false;
      nextBtn.textContent = "ANALYZE MY PROFILE →";
      alert(e.message || "Could not save your assessment. Please try again.");
    }
  }

  render();
})();
