/* ============================================================
   PATHWISE — MAIN (landing page interactions)
   ============================================================ */

(function(){

  /* ---- mobile menu ---- */
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  if(hamburger && mobileMenu){
    hamburger.addEventListener("click", ()=> mobileMenu.classList.toggle("open"));
    mobileMenu.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=> mobileMenu.classList.remove("open"));
    });
  }

  /* ---- ambient particles ---- */
  const field = document.querySelector(".particles");
  if(field){
    for(let i=0;i<28;i++){
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random()*100 + "%";
      p.style.bottom = "-10px";
      p.style.animationDuration = (10 + Math.random()*14) + "s";
      p.style.animationDelay = (Math.random()*10) + "s";
      p.style.opacity = .3 + Math.random()*.4;
      field.appendChild(p);
    }
  }

  /* ---- twinkling star field (hero backdrop) ---- */
  const starField = document.getElementById("star-field");
  if(starField){
    for(let i=0;i<50;i++){
      const s = document.createElement("span");
      s.style.left = Math.random()*100 + "%";
      s.style.top = Math.random()*70 + "%";
      s.style.animationDelay = (Math.random()*3.4) + "s";
      s.style.animationDuration = (2.4 + Math.random()*2.4) + "s";
      starField.appendChild(s);
    }
  }

  /* ---- career universe: draw connector lines from REAL node positions ----
     Previously these lines used hand-typed coordinates that had to match
     hand-typed CSS node positions — any drift between the two silently
     broke the layout (as happened twice). Computing lines from each
     node's actual rendered position removes that failure mode entirely:
     they will always terminate exactly on the node and the center,
     regardless of node count, spacing, or screen size. */
  function drawUniverseLines(){
    const universe = document.querySelector(".universe");
    const svg = document.getElementById("universe-svg");
    const linesGroup = document.getElementById("universe-lines");
    const centerEl = document.getElementById("universe-center");
    if(!universe || !svg || !linesGroup || !centerEl) return;

    const svgRect = svg.getBoundingClientRect();
    if(svgRect.width === 0 || svgRect.height === 0) return;

    const vb = svg.viewBox.baseVal;

    function toSvgPoint(rect){
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return {
        x: vb.x + ((cx - svgRect.left) / svgRect.width) * vb.width,
        y: vb.y + ((cy - svgRect.top) / svgRect.height) * vb.height
      };
    }

    const centerPoint = toSvgPoint(centerEl.getBoundingClientRect());
    const nodes = universe.querySelectorAll(".node");

    linesGroup.innerHTML = "";
    nodes.forEach(node=>{
      const p = toSvgPoint(node.getBoundingClientRect());
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "energy");
      line.setAttribute("x1", centerPoint.x.toFixed(1));
      line.setAttribute("y1", centerPoint.y.toFixed(1));
      line.setAttribute("x2", p.x.toFixed(1));
      line.setAttribute("y2", p.y.toFixed(1));
      linesGroup.appendChild(line);
    });
  }

  if(document.getElementById("universe-svg")){
    // Nodes have a continuous CSS "floaty" bob animation — lines must be
    // redrawn every frame to stay glued to them, not just once on load,
    // or they drift apart as soon as the bob animation moves the node.
    let rafId = null;
    function loop(){
      drawUniverseLines();
      rafId = requestAnimationFrame(loop);
    }
    const universeSection = document.querySelector(".universe");
    if("IntersectionObserver" in window && universeSection){
      const io = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            if(rafId === null) loop();
          }else{
            if(rafId !== null){ cancelAnimationFrame(rafId); rafId = null; }
          }
        });
      }, { threshold: 0 });
      io.observe(universeSection);
    }else{
      loop();
    }
  }

  /* ---- career universe: gentle mouse parallax on the whole cluster ---- */
  const universe = document.querySelector(".universe");
  if(universe){
    universe.addEventListener("mousemove", e=>{
      const rect = universe.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      universe.style.transform = `translate(${px*14}px, ${py*14}px)`;
    });
    universe.addEventListener("mouseleave", ()=>{
      universe.style.transform = "";
    });
  }

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if(revealEls.length){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold:.15 });
    revealEls.forEach(el=>io.observe(el));
  }

  /* ---- terminal typing animation ---- */
  const terminalBody = document.querySelector("[data-terminal]");
  if(terminalBody){
    const lines = [
      "SYSTEM INITIALIZED",
      "WAITING FOR USER PROFILE...",
      "USER PROFILE DETECTED",
      "INTEREST: WEB DEVELOPMENT",
      "EXPERIENCE: BEGINNER",
      "GOAL: SOFTWARE ENGINEER",
      "ANALYZING PROFILE...",
      "MATCH FOUND.",
      "RECOMMENDED PATH:",
      "FRONTEND DEVELOPER",
      "READY TO BEGIN."
    ];
    let li = 0;
    function typeLine(){
      if(li >= lines.length){
        setTimeout(()=>{ terminalBody.innerHTML=""; li=0; typeLine(); }, 2400);
        return;
      }
      const row = document.createElement("div");
      const prefix = document.createElement("span");
      prefix.className = "c"; prefix.textContent = ">";
      const text = document.createElement("span");
      text.className = lines[li].includes("PATH") || lines[li].includes("MATCH") || lines[li]==="READY TO BEGIN." ? "l" : "";
      row.appendChild(prefix); row.appendChild(text);
      terminalBody.appendChild(row);

      let ci = 0;
      const full = lines[li];
      const interval = setInterval(()=>{
        text.textContent = full.slice(0, ci+1);
        ci++;
        if(ci >= full.length){
          clearInterval(interval);
          li++;
          setTimeout(typeLine, 260);
        }
      }, 22);
    }
    typeLine();
  }

  /* ---- career universe node hover descriptions ---- */
  const nodeDescs = {
    web: "Build sites, apps, and interfaces.",
    ai: "Train models and intelligent systems.",
    data: "Turn raw data into decisions.",
    cyber: "Defend systems and networks.",
    mobile: "Ship apps for Android & iOS.",
    uiux: "Design intuitive, delightful interfaces."
  };
  document.querySelectorAll(".node[data-node]").forEach(node=>{
    const key = node.getAttribute("data-node");
    const descEl = node.querySelector(".desc");
    if(descEl && nodeDescs[key]) descEl.textContent = nodeDescs[key];
  });

})();
