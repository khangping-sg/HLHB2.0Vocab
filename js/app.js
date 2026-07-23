/* ============================================================
   华文小乐园 — app logic (demo mode: progress saved in-browser)
   ============================================================ */

const ALL_LEVELS = [
  {id:"1A", label:"1A"}, {id:"1B", label:"1B"},
  {id:"2A", label:"2A"}, {id:"2B", label:"2B"},
  {id:"3A", label:"3A"}, {id:"3B", label:"3B"},
  {id:"4A", label:"4A"}, {id:"4B", label:"4B"},
  {id:"5A", label:"5A"}, {id:"5B", label:"5B"},
  {id:"6A", label:"6A"}, {id:"6B", label:"6B"}
];
const BUILT_LEVELS = { "1B": LEVEL_1B };

const PLANT_STAGES = ["🌱","🌿","🌼","🌸","🌻"]; // 0-24,25-49,50-74,75-94,95-100
function plantForPct(p){
  if(p>=95) return PLANT_STAGES[4];
  if(p>=75) return PLANT_STAGES[3];
  if(p>=50) return PLANT_STAGES[2];
  if(p>=25) return PLANT_STAGES[1];
  return PLANT_STAGES[0];
}

const DEMO_STUDENTS = [
  {id:"s1", name:"小明 (Xiao Ming)"},
  {id:"s2", name:"小华 (Xiao Hua)"},
  {id:"s3", name:"小丽 (Xiao Li)"}
];

/* ---------- persistence (demo: localStorage only) ---------- */
const STORE_KEY = "huawen_xiaoleyuan_progress_v1";

function loadStore(){
  let raw = localStorage.getItem(STORE_KEY);
  if(raw){ try{ return JSON.parse(raw); }catch(e){ /* fall through */ } }
  // seed some plausible demo progress so Teacher/Parent views aren't empty
  const seeded = { students:{} };
  DEMO_STUDENTS.forEach((s,i)=>{
    seeded.students[s.id] = { name:s.name, lessons:{} };
    LEVEL_1B.lessons.forEach((les,j)=>{
      // a rough front-loaded progress curve, varies per student
      let base = Math.max(0, 90 - j*11 - i*8 + (i===1?15:0));
      if(base>100) base=100;
      if(j===0) base = Math.max(base, 60);
      seeded.students[s.id].lessons["1B-"+les.no] = { quizBest: Math.max(0, Math.min(100, base)) };
    });
  });
  localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveStore(store){ localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
let STORE = loadStore();

function ensureStudent(id, name){
  if(!STORE.students[id]) STORE.students[id] = { name, lessons:{} };
  return STORE.students[id];
}
function getLessonProgress(studentId, levelId, lessonNo){
  const st = STORE.students[studentId];
  if(!st) return 0;
  const key = levelId+"-"+lessonNo;
  return (st.lessons[key] && st.lessons[key].quizBest) || 0;
}
function setLessonProgress(studentId, levelId, lessonNo, score){
  const st = ensureStudent(studentId, STATE.user.studentName);
  const key = levelId+"-"+lessonNo;
  const prev = (st.lessons[key] && st.lessons[key].quizBest) || 0;
  st.lessons[key] = { quizBest: Math.max(prev, score) };
  saveStore(STORE);
}
function overallPct(studentId){
  const st = STORE.students[studentId];
  if(!st) return 0;
  const lessons = LEVEL_1B.lessons;
  let sum=0; lessons.forEach(l=> sum += getLessonProgress(studentId,"1B",l.no));
  return Math.round(sum/lessons.length);
}

/* ---------- app state ---------- */
const STATE = {
  user: null,        // { role:'teacher'|'parent'|'student', studentId, studentName }
  level: "1B",
  lessonNo: null,
  section: "words",
  quiz: null
};

const root = document.getElementById("app-root");

/* ============================================================
   LOGIN
   ============================================================ */
function renderLogin(){
  root.innerHTML = `
  <div class="login-screen">
    <div class="login-card" id="login-card">
      <div style="font-size:2.4rem">🌼</div>
      <h1 class="login-title">华文小乐园</h1>
      <p class="login-sub">Huawen Xiao Le Yuan — Chinese Little Garden</p>
      <div id="login-body"></div>
    </div>
  </div>`;
  renderRoleChoice();
}

function renderRoleChoice(){
  document.getElementById("login-body").innerHTML = `
    <div class="role-grid">
      <button class="role-btn" data-role="student">
        <span class="role-emoji">🧒</span>
        <span><span class="role-name">Student 学生</span><br><span class="role-desc">Practise and see your own progress</span></span>
      </button>
      <button class="role-btn" data-role="parent">
        <span class="role-emoji">👪</span>
        <span><span class="role-name">Parent 家长</span><br><span class="role-desc">See your child's progress only</span></span>
      </button>
      <button class="role-btn" data-role="teacher">
        <span class="role-emoji">🍎</span>
        <span><span class="role-name">Teacher 老师</span><br><span class="role-desc">See progress for all students</span></span>
      </button>
    </div>
    <p style="margin-top:16px;font-size:.78rem;color:#B7AF9D">Demo mode — no password needed. Progress is saved in this browser only.</p>
  `;
  document.querySelectorAll(".role-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> renderRoleDetail(btn.dataset.role));
  });
}

function renderRoleDetail(role){
  const body = document.getElementById("login-body");
  if(role==="teacher"){
    body.innerHTML = `
      <p style="color:#8A8272">You'll see a consolidated view of every student's progress.</p>
      <button class="login-go" id="go-teacher">Enter as Teacher</button>
      <button class="login-back" id="back">← Back</button>`;
    document.getElementById("go-teacher").addEventListener("click", ()=>{
      STATE.user = { role:"teacher" };
      startApp();
    });
  } else {
    const label = role==="parent" ? "Which child is yours?" : "Who are you?";
    body.innerHTML = `
      <div class="student-picker">
        <label>${label}</label>
        <select id="student-select">
          ${DEMO_STUDENTS.map(s=>`<option value="${s.id}">${s.name}</option>`).join("")}
        </select>
      </div>
      <button class="login-go" id="go-role">Enter as ${role==="parent"?"Parent":"Student"}</button>
      <button class="login-back" id="back">← Back</button>`;
    document.getElementById("go-role").addEventListener("click", ()=>{
      const sel = document.getElementById("student-select");
      const s = DEMO_STUDENTS.find(x=>x.id===sel.value);
      ensureStudent(s.id, s.name);
      STATE.user = { role, studentId:s.id, studentName:s.name };
      startApp();
    });
  }
  document.getElementById("back").addEventListener("click", renderRoleChoice);
}

/* ============================================================
   APP SHELL
   ============================================================ */
function startApp(){
  STATE.level="1B"; STATE.lessonNo=null; STATE.section="words";
  renderShell();
}

function whoLabel(){
  const u=STATE.user;
  if(u.role==="teacher") return "Teacher view · all students";
  if(u.role==="parent") return "Parent view · "+u.studentName;
  return "Student · "+u.studentName;
}

function renderShell(){
  root.innerHTML = `
    <div class="app-header">
      <div class="brand"><span class="brand-mark">🌼</span><span class="brand-name">华文小乐园</span></div>
      <div class="header-right">
        <span class="who-chip">${whoLabel()}</span>
        ${STATE.user.role!=="student" ? `<button class="dash-btn" id="dash-btn">📊 ${STATE.user.role==="teacher"?"All students":"My child"}</button>`:""}
        <button class="logout-btn" id="logout-btn">Log out</button>
      </div>
    </div>
    <div class="level-tabs" id="level-tabs"></div>
    <main id="main-area"></main>
  `;
  const tabWrap = document.getElementById("level-tabs");
  ALL_LEVELS.forEach(lv=>{
    const built = !!BUILT_LEVELS[lv.id];
    const tab = document.createElement("button");
    tab.className = "level-tab" + (lv.id===STATE.level?" active":"") + (!built?" locked":"");
    tab.textContent = lv.label;
    tab.addEventListener("click", ()=>{
      STATE.level = lv.id; STATE.lessonNo=null;
      renderShell();
    });
    tabWrap.appendChild(tab);
  });
  document.getElementById("logout-btn").addEventListener("click", ()=>{ STATE.user=null; renderLogin(); });
  if(STATE.user.role!=="student"){
    document.getElementById("dash-btn").addEventListener("click", renderDashboard);
  }
  renderMain();
}

function renderMain(){
  const area = document.getElementById("main-area");
  if(!BUILT_LEVELS[STATE.level]){
    area.innerHTML = `
      <div class="coming-soon">
        <div class="seed">🌱</div>
        <h2>${STATE.level} is being planted</h2>
        <p>This level isn't built yet — ask your teacher to share the lesson content and it'll grow here next.</p>
      </div>`;
    return;
  }
  if(STATE.lessonNo==null){ renderGarden(area); }
  else { renderLesson(area); }
}

/* ============================================================
   GARDEN (lesson map)
   ============================================================ */
function renderGarden(area){
  const level = BUILT_LEVELS[STATE.level];
  const sid = STATE.user.role==="teacher" ? null : STATE.user.studentId;
  area.innerHTML = `
    <div class="garden-intro">
      <h2>${level.fullLabel} 生字花园</h2>
      <p>Tap a plot to open that lesson. Finish the quiz to help it bloom!</p>
    </div>
    <div class="garden-grid" id="garden-grid"></div>
  `;
  const grid = document.getElementById("garden-grid");
  level.lessons.forEach(les=>{
    const pct = sid ? getLessonProgress(sid, STATE.level, les.no) : avgAcrossStudents(STATE.level, les.no);
    const div = document.createElement("button");
    div.className="plot";
    div.innerHTML = `
      <div class="plot-top"><span class="plot-no">第${les.chinese}课</span><span class="plot-plant">${plantForPct(pct)}</span></div>
      <div class="plot-title">${les.title}</div>
      <div class="plot-bar"><div class="plot-bar-fill" style="width:${pct}%"></div></div>
      <div class="plot-pct">${pct}% mastered</div>
    `;
    div.addEventListener("click", ()=>{
      STATE.lessonNo = les.no; STATE.section="words";
      renderMain();
    });
    grid.appendChild(div);
  });
}
function avgAcrossStudents(levelId, lessonNo){
  const ids = Object.keys(STORE.students);
  if(!ids.length) return 0;
  let sum=0; ids.forEach(id=> sum+= getLessonProgress(id, levelId, lessonNo));
  return Math.round(sum/ids.length);
}

/* ============================================================
   LESSON VIEW
   ============================================================ */
function currentLesson(){
  return BUILT_LEVELS[STATE.level].lessons.find(l=>l.no===STATE.lessonNo);
}

function renderLesson(area){
  const les = currentLesson();
  area.innerHTML = `
    <div class="lesson-header">
      <button class="back-link" id="back-to-garden">← Garden</button>
    </div>
    <h2 class="lesson-title">第${les.chinese}课 · ${les.title}</h2>
    <p class="lesson-sub">Lesson ${les.no} · 1B</p>
    <div class="section-tabs" id="section-tabs">
      ${sectionTab("words","🌼 词语 Words")}
      ${sectionTab("chars","🈶 生字 Characters")}
      ${sectionTab("radicals","🧩 部首 Radicals")}
      ${sectionTab("stroke","✍️ 笔顺 Stroke order")}
      ${sectionTab("quiz","📝 小测验 Quiz")}
    </div>
    <div id="section-body"></div>
  `;
  document.getElementById("back-to-garden").addEventListener("click", ()=>{ STATE.lessonNo=null; renderMain(); });
  document.querySelectorAll(".section-tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{ STATE.section=btn.dataset.section; renderSectionBody(); });
  });
  renderSectionBody();
}
function sectionTab(key,label){
  return `<button class="section-tab${STATE.section===key?" active":""}" data-section="${key}">${label}</button>`;
}

function renderSectionBody(){
  document.querySelectorAll(".section-tab").forEach(b=> b.classList.toggle("active", b.dataset.section===STATE.section));
  const body = document.getElementById("section-body");
  const les = currentLesson();
  if(STATE.section==="words") return renderWordCards(body, les);
  if(STATE.section==="chars") return renderCharCards(body, les);
  if(STATE.section==="radicals") return renderRadicals(body, les);
  if(STATE.section==="stroke") return renderStroke(body, les);
  if(STATE.section==="quiz") return renderQuiz(body, les);
}

/* ---- flashcards: words (with icons) ---- */
function renderWordCards(body, les){
  body.innerHTML = `<div class="card-grid">${les.words.map((w,i)=>flashCardHTML("w"+i, w[0], w[1], w[2], ICONS[w[0]])).join("")}</div>`;
  wireFlips(body);
}
function renderCharCards(body, les){
  body.innerHTML = `<div class="card-grid">${les.recognizeChars.map((c,i)=>{
    const info = CHAR_INFO[c] || ["",""];
    return flashCardHTML("c"+i, c, info[0], info[1], null);
  }).join("")}</div>`;
  wireFlips(body);
}
function flashCardHTML(id, hanzi, pinyin, meaning, iconSvg){
  return `
  <div class="flip-card" id="${id}">
    <div class="flip-inner">
      <div class="flip-face front">
        ${iconSvg ? `<div class="card-icon">${iconSvg}</div>` : ""}
        <div class="card-hanzi">${hanzi}</div>
        <div class="card-hint">tap to flip</div>
      </div>
      <div class="flip-face back">
        <div class="card-pinyin">${pinyin}</div>
        <div class="card-meaning">${meaning}</div>
      </div>
    </div>
  </div>`;
}
function wireFlips(body){
  body.querySelectorAll(".flip-card").forEach(card=>{
    card.addEventListener("click", ()=> card.classList.toggle("flipped"));
  });
}

/* ---- radicals ---- */
function renderRadicals(body, les){
  body.innerHTML = `
    <div class="radical-list">
      ${les.radicals.map(r=>`
        <div class="radical-row">
          <div class="radical-glyph">${r.form}</div>
          <div>
            <div class="radical-name">${r.name} (${r.form})</div>
            <div class="radical-ex">${r.examples.map(e=>`<b>${e}</b>`).join(" ")}</div>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="rule-box">
      <span style="font-size:1.4rem">💡</span>
      <div><b>Stroke order rule:</b> ${les.strokeRule}<br><span style="color:#5c6b5d">New stroke type: ${les.strokeFocus}</span></div>
    </div>
  `;
}

/* ---- stroke order (HanziWriter) ---- */
let hwInstance = null;
function renderStroke(body, les){
  body.innerHTML = `
    <div class="stroke-picker" id="stroke-picker"></div>
    <div class="stroke-panel">
      <div id="stroke-target" style="width:260px;height:260px;"></div>
      <div class="stroke-info">
        <div class="card-pinyin" id="stroke-pinyin"></div>
        <div class="card-meaning" id="stroke-meaning"></div>
        <div class="stroke-btns">
          <button class="primary" id="stroke-animate">▶ Animate</button>
          <button id="stroke-quiz">✍️ Try writing it</button>
        </div>
      </div>
    </div>
  `;
  const picker = document.getElementById("stroke-picker");
  les.writeChars.forEach((c,i)=>{
    const chip = document.createElement("button");
    chip.className = "stroke-chip" + (i===0?" active":"");
    chip.textContent = c;
    chip.addEventListener("click", ()=>{
      picker.querySelectorAll(".stroke-chip").forEach(x=>x.classList.remove("active"));
      chip.classList.add("active");
      loadStrokeChar(c);
    });
    picker.appendChild(chip);
  });
  loadStrokeChar(les.writeChars[0]);
  document.getElementById("stroke-animate").addEventListener("click", ()=> hwInstance && hwInstance.animateCharacter());
  document.getElementById("stroke-quiz").addEventListener("click", ()=> hwInstance && hwInstance.quiz());
}
function loadStrokeChar(c){
  const info = CHAR_INFO[c] || ["",""];
  document.getElementById("stroke-pinyin").textContent = c + "  ·  " + info[0];
  document.getElementById("stroke-meaning").textContent = info[1];
  const target = document.getElementById("stroke-target");
  target.innerHTML = "";
  if(typeof HanziWriter === "undefined"){
    target.innerHTML = `<div style="padding:20px;color:#B7AF9D;font-size:.85rem">Stroke order needs an internet connection to load character data.</div>`;
    return;
  }
  hwInstance = HanziWriter.create("stroke-target", c, {
    width:260, height:260, padding:16,
    strokeColor:"#1F7A4D", radicalColor:"#E8503A",
    outlineColor:"#DDE6DF", showOutline:true,
    strokeAnimationSpeed:1, delayBetweenStrokes:250
  });
}

/* ---- quiz ---- */
function buildQuizPool(les){
  const items = [];
  les.words.forEach(w=> items.push({hanzi:w[0], pinyin:w[1], meaning:w[2]}));
  les.recognizeChars.forEach(c=>{
    const info = CHAR_INFO[c];
    if(info) items.push({hanzi:c, pinyin:info[0], meaning:info[1]});
  });
  return items;
}
function renderQuiz(body, les){
  const pool = buildQuizPool(les);
  const qCount = Math.min(8, pool.length);
  const shuffled = [...pool].sort(()=>Math.random()-.5).slice(0,qCount);
  STATE.quiz = { les, questions:shuffled, index:0, correct:0, pool };
  paintQuiz(body);
}
function paintQuiz(body){
  const q = STATE.quiz;
  if(q.index >= q.questions.length){
    const pct = Math.round(100*q.correct/q.questions.length);
    if(STATE.user.role==="student"){
      setLessonProgress(STATE.user.studentId, STATE.level, q.les.no, pct);
    }
    body.innerHTML = `
      <div class="quiz-box quiz-result">
        <div class="seed">${pct>=75?"🌸":pct>=50?"🌼":"🌱"}</div>
        <h2>${pct}% correct</h2>
        <p>${q.correct} of ${q.questions.length} right.</p>
        ${STATE.user.role==="student" ? "<p style='color:#8A8272;font-size:.85rem'>Your best score for this lesson has been saved to your garden.</p>" : "<p style='color:#8A8272;font-size:.85rem'>Log in as this student to save quiz scores.</p>"}
        <button class="quiz-restart" id="quiz-again">Try again</button>
      </div>`;
    document.getElementById("quiz-again").addEventListener("click", ()=> renderQuiz(body, q.les));
    return;
  }
  const item = q.questions[q.index];
  const distractors = q.pool.filter(x=>x.hanzi!==item.hanzi).sort(()=>Math.random()-.5).slice(0,3);
  const options = [item, ...distractors].sort(()=>Math.random()-.5);
  body.innerHTML = `
    <div class="quiz-box">
      <div class="quiz-progress">Question ${q.index+1} / ${q.questions.length}</div>
      <div class="quiz-q"><span class="prompt-hanzi">${item.hanzi}</span>What does this mean?</div>
      <div class="quiz-opts" id="quiz-opts">
        ${options.map((o,i)=>`<button class="quiz-opt" data-correct="${o.hanzi===item.hanzi}">${o.meaning} <span style="color:#B7AF9D;font-size:.8rem">(${o.pinyin})</span></button>`).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".quiz-opt").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if(btn.dataset.locked) return;
      document.querySelectorAll(".quiz-opt").forEach(b=> b.dataset.locked="1");
      const ok = btn.dataset.correct==="true";
      btn.classList.add(ok?"correct":"wrong");
      if(ok) q.correct++;
      else document.querySelector(`.quiz-opt[data-correct="true"]`).classList.add("correct");
      setTimeout(()=>{ q.index++; paintQuiz(body); }, 900);
    });
  });
}

/* ============================================================
   DASHBOARDS
   ============================================================ */
function renderDashboard(){
  const area = document.getElementById("main-area");
  const isTeacher = STATE.user.role==="teacher";
  const ids = isTeacher ? DEMO_STUDENTS.map(s=>s.id) : [STATE.user.studentId];
  area.innerHTML = `
    <button class="back-link" id="back-from-dash">← Back to lessons</button>
    <h2 class="dash-title">${isTeacher?"All students":"Your child's progress"}</h2>
    <p class="dash-sub">${isTeacher? "Level 1B · lessons 11–19" : STATE.user.studentName+" · Level 1B"}</p>
    <div id="dash-list"></div>
  `;
  document.getElementById("back-from-dash").addEventListener("click", renderMain);
  const list = document.getElementById("dash-list");
  ids.forEach(id=>{
    const name = STORE.students[id] ? STORE.students[id].name : id;
    const overall = overallPct(id);
    const rows = LEVEL_1B.lessons.map(l=>{
      const pct = getLessonProgress(id,"1B",l.no);
      return `<div class="mini-bar-row"><span class="lbl">第${l.chinese}课</span><div class="mini-bar"><div class="mini-bar-fill" style="width:${pct}%"></div></div><span>${pct}%</span></div>`;
    }).join("");
    const card = document.createElement("div");
    card.className="student-card";
    card.innerHTML = `
      <div class="student-card-top"><span class="student-name">${name}</span><span class="student-overall">${overall}% overall</span></div>
      ${rows}
    `;
    list.appendChild(card);
  });
}

/* ============================================================
   BOOT
   ============================================================ */
renderLogin();
