/* ============================================================
   PATHWISE — WINDING ROAD JOURNEY TRACKER
   -----------------------------------------------------------
   Renders the learning journey as a curved, hoverable "road":
     - a wavy road path sized to the number of topics
     - milestone nodes (completed / current / locked)
     - a car marker sitting at the current topic
     - hover-to-inspect tooltips along the road
   Pure SVG + vanilla JS. No external assets.
   ============================================================ */

const PWRoad = (() => {

  const W = 1200, H = 300, BASE_Y = 150;

  function buildSamples(waves, amplitude, count){
    const samples = [];
    const n = 420;
    for(let i=0;i<=n;i++){
      const x = (i/n) * W;
      const y = BASE_Y + Math.sin((i/n) * waves * Math.PI * 2) * amplitude;
      samples.push({x,y});
    }
    // cumulative arc length
    let len = 0;
    const cum = [0];
    for(let i=1;i<samples.length;i++){
      const dx = samples[i].x - samples[i-1].x;
      const dy = samples[i].y - samples[i-1].y;
      len += Math.sqrt(dx*dx + dy*dy);
      cum.push(len);
    }
    return { samples, cum, total: len };
  }

  function pathAtFraction(samples, cum, total, fraction){
    const target = fraction * total;
    let lo = 0, hi = cum.length - 1;
    while(lo < hi){
      const mid = (lo + hi) >> 1;
      if(cum[mid] < target) lo = mid + 1; else hi = mid;
    }
    return { point: samples[lo], index: lo };
  }

  function tangentAngle(samples, index){
    const a = samples[Math.max(0, index - 4)];
    const b = samples[Math.min(samples.length - 1, index + 4)];
    return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
  }

  function svgEl(tag, attrs){
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
    return el;
  }

  function render(container, { topics, progress, phases }){
    container.innerHTML = "";

    const waves = Math.min(5, Math.max(2, Math.round(topics.length / 3)));
    const { samples, cum, total } = buildSamples(waves, 68, topics.length);
    const dAttr = "M" + samples.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L");

    const completedCount = topics.filter(t => progress.completedTopics.includes(t.id)).length;
    const progressFraction = topics.length > 1 ? completedCount / (topics.length - 1) : 0;

    // --- svg holder ---
    const holder = document.createElement("div");
    holder.className = "road-svg-holder";
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none" });

    const defs = svgEl("defs", {});
    const grad = svgEl("linearGradient", { id: "roadProgressGrad", x1: "0%", y1: "0%", x2: "100%", y2: "0%" });
    grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#8B5CF6" }));
    grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#38BDF8" }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    const roadBase = svgEl("path", {
      d: dAttr, fill: "none", stroke: "#000000", "stroke-opacity": "0.35",
      "stroke-width": "40", "stroke-linecap": "round", "stroke-linejoin": "round"
    });
    const roadSurface = svgEl("path", {
      d: dAttr, fill: "none", stroke: "#2a2a30", "stroke-width": "34",
      "stroke-linecap": "round", "stroke-linejoin": "round", class: "road-surface"
    });
    const roadCenter = svgEl("path", {
      d: dAttr, fill: "none", stroke: "#F4C542", "stroke-width": "3",
      "stroke-dasharray": "14 14", "stroke-linecap": "round", class: "road-center"
    });

    const progressLen = total * progressFraction;
    const roadProgress = svgEl("path", {
      d: dAttr, fill: "none", stroke: "url(#roadProgressGrad)", "stroke-width": "6",
      "stroke-linecap": "round", class: "road-progress",
      "stroke-dasharray": `${progressLen} ${total - progressLen}`
    });

    svg.appendChild(roadBase);
    svg.appendChild(roadSurface);
    svg.appendChild(roadCenter);
    svg.appendChild(roadProgress);

    // --- topic nodes ---
    const nodeMeta = [];
    topics.forEach((t, i) => {
      const frac = topics.length > 1 ? i / (topics.length - 1) : 0;
      const { point } = pathAtFraction(samples, cum, total, frac);
      const state = progress.completedTopics.includes(t.id)
        ? "completed"
        : progress.currentTopic === t.id ? "current" : "locked";

      const tickTop = point.y - (i % 2 === 0 ? 46 : 30);
      const tick = svgEl("line", {
        x1: point.x, y1: point.y, x2: point.x, y2: tickTop,
        stroke: state === "locked" ? "#3a3a3f" : (state === "completed" ? "#A3FF12" : "#8B5CF6"),
        "stroke-width": "1.4", "stroke-opacity": state === "locked" ? "0.5" : "0.9"
      });
      const dot = svgEl("circle", {
        cx: point.x, cy: point.y, r: state === "current" ? 9 : 7,
        fill: state === "completed" ? "#A3FF12" : state === "current" ? "#8B5CF6" : "#151515",
        stroke: state === "locked" ? "#3a3a3f" : "#ffffff", "stroke-width": "1.5",
        class: "road-node-dot " + state, style: "cursor:" + (state === "locked" ? "not-allowed" : "pointer")
      });
      if(state === "current"){
        const pulse = svgEl("circle", { cx: point.x, cy: point.y, r: 9, fill: "none", stroke: "#8B5CF6", "stroke-width": "2", class: "road-pulse" });
        svg.appendChild(pulse);
      }
      svg.appendChild(tick);
      svg.appendChild(dot);

      nodeMeta.push({ topic: t, point, tickTop, state, frac });

      dot.addEventListener("click", () => {
        if(state !== "locked") window.location.href = `learning.html?topic=${t.id}`;
      });
    });

    // --- car marker at current progress ---
    const carFraction = topics.length > 1 ? completedCount / (topics.length - 1) : 0;
    const carPos = pathAtFraction(samples, cum, total, carFraction);
    const carAngle = tangentAngle(samples, carPos.index);
    const car = svgEl("text", {
      x: carPos.point.x, y: carPos.point.y - 16, "font-size": "26",
      "text-anchor": "middle", class: "road-car"
    });
    car.style.setProperty("--angle", carAngle + "deg");
    car.style.transformOrigin = `${carPos.point.x}px ${carPos.point.y - 16}px`;
    car.textContent = "🚗";
    svg.appendChild(car);

    holder.appendChild(svg);

    // --- HTML labels (percentage-positioned to match viewBox) ---
    nodeMeta.forEach(({ topic, point, tickTop, state }) => {
      const label = document.createElement("div");
      label.className = "road-node-label " + state;
      label.style.left = (point.x / W * 100) + "%";
      label.style.top = (tickTop / H * 100) + "%";
      label.textContent = topic.name;
      holder.appendChild(label);
    });

    // phase start/end tags
    if(phases && phases.length){
      const startTag = document.createElement("div");
      startTag.className = "road-phase-tag start";
      startTag.textContent = phases[0].phase;
      const endTag = document.createElement("div");
      endTag.className = "road-phase-tag end";
      endTag.textContent = "GOAL 🏁";
      holder.appendChild(startTag);
      holder.appendChild(endTag);
    }

    // --- tooltip ---
    const tooltip = document.createElement("div");
    tooltip.className = "road-tooltip";
    holder.appendChild(tooltip);

    function showTooltip(meta, clientFracX, clientFracY){
      const { topic, state } = meta;
      tooltip.innerHTML = `<h4>${topic.name}</h4><div class="st">STATUS: ${state.toUpperCase()}</div>` +
        (state === "locked" ? `<div style="color:var(--text-secondary);margin-top:4px;">Complete previous topics to unlock.</div>` : "");
      tooltip.style.left = clientFracX + "%";
      tooltip.style.top = clientFracY + "%";
      tooltip.classList.add("show");
    }
    function hideTooltip(){ tooltip.classList.remove("show"); }

    holder.addEventListener("pointermove", (e) => {
      const rect = holder.getBoundingClientRect();
      const localX = (e.clientX - rect.left) / rect.width * W;
      let nearest = null, nearestDist = Infinity;
      nodeMeta.forEach(meta => {
        const dist = Math.abs(meta.point.x - localX);
        if(dist < nearestDist){ nearestDist = dist; nearest = meta; }
      });
      if(nearest && nearestDist < (W / topics.length) * 0.5){
        showTooltip(nearest, nearest.point.x / W * 100, nearest.tickTop / H * 100);
        holder.classList.add("road-hover-active");
      }else{
        hideTooltip();
        holder.classList.remove("road-hover-active");
      }
    });
    holder.addEventListener("pointerleave", () => { hideTooltip(); holder.classList.remove("road-hover-active"); });

    container.appendChild(holder);

    return { completedCount, total: topics.length, percentage: Math.round((completedCount/Math.max(1,topics.length))*100) };
  }

  return { render };
})();
