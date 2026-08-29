/* ============================================================
   PATHWISE — AUTH CONTROLLER
   Wires up the sign-up / sign-in forms and route guarding.
   Backed by the FastAPI + MongoDB API (see js/storage.js).
   ============================================================ */

const PWAuth = (() => {

  function requireAuth(){
    if(!PWStore.session.isAuthed()){
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  function redirectIfAuthed(){
    if(PWStore.session.isAuthed()){
      window.location.href = "dashboard.html";
    }
  }

  /** Synchronous cached user (name/email/education) — good enough for nav/UI paint. */
  function currentUser(){
    return PWStore.users.cached();
  }

  function logout(){
    PWStore.session.logout();
    window.location.href = "index.html";
  }

  function showMsg(el, text, type){
    el.textContent = text;
    el.className = "form-msg show " + type;
  }

  function setFieldError(fieldEl, msg){
    fieldEl.classList.add("invalid");
    const err = fieldEl.querySelector(".field-error");
    if(err) err.textContent = msg;
  }
  function clearFieldError(fieldEl){
    fieldEl.classList.remove("invalid");
  }

  function initSignup(){
    const form = document.getElementById("signup-form");
    if(!form) return;
    const msg = document.getElementById("signup-msg");

    form.addEventListener("submit", async e=>{
      e.preventDefault();
      const name = document.getElementById("su-name");
      const email = document.getElementById("su-email");
      const pass = document.getElementById("su-password");
      const confirm = document.getElementById("su-confirm");
      const terms = document.getElementById("su-terms");
      const education = document.getElementById("su-education");

      [name,email,pass,confirm].forEach(f=>clearFieldError(f.closest(".field")));

      let valid = true;
      if(name.value.trim().length < 2){ setFieldError(name.closest(".field"),"Please enter your full name."); valid=false; }
      if(!/^\S+@\S+\.\S+$/.test(email.value)){ setFieldError(email.closest(".field"),"Enter a valid email address."); valid=false; }
      if(pass.value.length < 6){ setFieldError(pass.closest(".field"),"Password must be at least 6 characters."); valid=false; }
      if(confirm.value !== pass.value){ setFieldError(confirm.closest(".field"),"Passwords do not match."); valid=false; }
      if(!terms.checked){ showMsg(msg,"You must agree to the terms and conditions.","error"); valid=false; }

      if(!valid) return;

      const submitBtn = form.querySelector("[type=submit]");
      if(submitBtn) submitBtn.disabled = true;

      const result = await PWStore.users.create({
        name:name.value.trim(), email:email.value.trim(),
        password:pass.value, education: education ? education.value : ""
      });

      if(submitBtn) submitBtn.disabled = false;

      if(!result.ok){
        showMsg(msg, result.error, "error");
        return;
      }

      showMsg(msg, "Account created. Redirecting to your career assessment...", "success");
      setTimeout(()=>{ window.location.href = "assessment.html"; }, 900);
    });
  }

  function initLogin(){
    const form = document.getElementById("login-form");
    if(!form) return;
    const msg = document.getElementById("login-msg");

    form.addEventListener("submit", async e=>{
      e.preventDefault();
      const email = document.getElementById("li-email");
      const pass = document.getElementById("li-password");
      [email,pass].forEach(f=>clearFieldError(f.closest(".field")));

      const submitBtn = form.querySelector("[type=submit]");
      if(submitBtn) submitBtn.disabled = true;

      const result = await PWStore.users.verify(email.value.trim(), pass.value);

      if(submitBtn) submitBtn.disabled = false;

      if(!result.ok){
        showMsg(msg, result.error, "error");
        return;
      }

      const userData = await PWStore.data.get();

      showMsg(msg, "Welcome back. Loading your journey...", "success");
      setTimeout(()=>{
        window.location.href = userData.assessment ? "dashboard.html" : "assessment.html";
      }, 700);
    });
  }

  function initNavUser(){
    const user = currentUser();
    document.querySelectorAll("[data-auth-signedout]").forEach(el=>{
      el.style.display = user ? "none" : "";
    });
    document.querySelectorAll("[data-auth-signedin]").forEach(el=>{
      el.style.display = user ? "" : "none";
    });
    document.querySelectorAll("[data-user-name]").forEach(el=>{
      if(user) el.textContent = user.name.split(" ")[0];
    });
    document.querySelectorAll("[data-user-avatar]").forEach(el=>{
      if(user) el.textContent = user.name.charAt(0).toUpperCase();
    });
    document.querySelectorAll("[data-logout]").forEach(btn=>{
      btn.addEventListener("click", logout);
    });
  }

  return { requireAuth, redirectIfAuthed, currentUser, logout, initSignup, initLogin, initNavUser };
})();

document.addEventListener("DOMContentLoaded", ()=>{
  PWAuth.initSignup();
  PWAuth.initLogin();
  PWAuth.initNavUser();
});
