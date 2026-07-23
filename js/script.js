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

/* ============================================================
   华文小乐园 — Level 1B lesson data (Lessons 11–19)
   Source: teacher-provided 生字表 (我会认 / 我会写), 2026-07-22
   ============================================================ */

const LEVEL_1B = {
  id: "1B",
  label: "1B",
  fullLabel: "小一下 (1B)",
  lessons: [
    {
      no: 11, chinese: "十一", title: "校园生活 / 方位",
      words: [
        ["同学","tóngxué","classmate"],["朋友","péngyou","friend"],
        ["前后","qiánhòu","front and back"],["左右","zuǒyòu","left and right"],
        ["中间","zhōngjiān","middle"],["周末","zhōumò","weekend"],
        ["回家","huíjiā","go home"],["起立","qǐlì","stand up"],
        ["发生","fāshēng","to happen"],["高大","gāodà","tall and big"],
        ["直走","zhízǒu","go straight"]
      ],
      recognizeChars: ["甲","丁","前","后","左","右","中","间","边","同","学","朋","友","坐","高","发","直","起","回","周","末"],
      writeChars: ["后","面","左","右","中","间","的","同","学","回","画"],
      radicals: [
        { name:"口字框", form:"囗", examples:["回","周"] },
        { name:"工字旁", form:"工", examples:["左"] },
        { name:"口字旁", form:"口", examples:["同","高"] }
      ],
      strokeFocus: "横折钩、横撇",
      strokeRule: "先外后内再封口（如：回、周）"
    },
    {
      no: 12, chinese: "十二", title: "饮食 / 动物",
      words: [
        ["鸡蛋","jīdàn","egg"],["米饭","mǐfàn","cooked rice"],
        ["鸭子","yāzi","duck"],["饥饿","jī'è","hungry"],
        ["吃饱","chībǎo","eat until full"],["饼干","bǐnggān","biscuit"],
        ["小狗","xiǎogǒu","puppy"],["喜欢","xǐhuan","to like"],
        ["吃肉","chīròu","eat meat"],["唱歌","chànggē","sing a song"],
        ["青菜","qīngcài","green vegetables"],["汤面","tāngmiàn","noodle soup"],
        ["蛋卷","dànjuǎn","egg roll"]
      ],
      recognizeChars: ["鸡","饭","鸭","肉","元","饿","饱","饼","干","狗","喜","欢","猫","歌","唱","青","菜","汤","蛋","香"],
      writeChars: ["包","肉","半","虫","元","今","吃","米","干","豆"],
      radicals: [
        { name:"食字旁", form:"饣", examples:["饭","饿","饱"] },
        { name:"鸟字旁", form:"鸟", examples:["鸡","鸭"] },
        { name:"草字头", form:"艹", examples:["菜"] }
      ],
      strokeFocus: "竖折折钩",
      strokeRule: "从左到右（如：饭、饱）"
    },
    {
      no: 13, chinese: "十三", title: "卫生习惯 / 洗漱",
      words: [
        ["刷牙","shuāyá","brush teeth"],["毛巾","máojīn","towel"],
        ["洗脸","xǐliǎn","wash face"],["洗澡","xǐzǎo","take a bath"],
        ["冲凉","chōngliáng","take a shower"],["东西","dōngxi","things"],
        ["谢谢","xièxie","thank you"],["请先","qǐngxiān","please go first"],
        ["变化","biànhuà","change"]
      ],
      recognizeChars: ["用","刷","巾","抹","洗","要","脸","放","冲","凉","东","西","到","先","请","很","泡","变","谢"],
      writeChars: ["用","牙","巾","以","要","东","西","雨","马","先","点"],
      radicals: [
        { name:"三点水", form:"氵", examples:["洗","澡","冲","凉","泡"] },
        { name:"巾字旁", form:"巾", examples:["巾","布"] }
      ],
      strokeFocus: "竖钩、点",
      strokeRule: "从上到下（如：要）"
    },
    {
      no: 14, chinese: "十四", title: "穿着 / 动作",
      words: [
        ["袜子","wàzi","socks"],["皮鞋","píxié","leather shoes"],
        ["衣服","yīfu","clothes"],["被子","bèizi","quilt"],
        ["红色","hóngsè","red colour"],["动作","dòngzuò","action"],
        ["快","kuài","fast"],["收拾","shōushi","tidy up"],
        ["做事","zuòshì","do things"]
      ],
      recognizeChars: ["这","双","袜","那","皮","鞋","件","服","被","还","色","红","都","动","作","快","收","拾","穿","事","做"],
      writeChars: ["是","皮","衣","和","里","尺","还","自","己","好"],
      radicals: [
        { name:"衣字旁", form:"衤", examples:["袜","衫","被"] },
        { name:"革字旁", form:"革", examples:["鞋"] },
        { name:"走之底", form:"辶", examples:["这","还"] }
      ],
      strokeFocus: "捺",
      strokeRule: "先中间后两边 / 先里头后封口"
    },
    {
      no: 15, chinese: "十五", title: "味道 / 感受",
      words: [
        ["甜饼","tiánbǐng","sweet cookie"],["辛苦","xīnkǔ","toilsome"],
        ["臭味","chòuwèi","bad smell"],["生病","shēngbìng","fall ill"],
        ["重要","zhòngyào","important"],["喝水","hēshuǐ","drink water"],
        ["甘甜","gāntián","sweet"],["果汁","guǒzhī","fruit juice"],
        ["办法","bànfǎ","method"],["圆圈","yuánquān","circle"],
        ["亲切","qīnqiè","kind, friendly"],["怎么","zěnme","how"]
      ],
      recognizeChars: ["甜","苦","臭","生","重","喝","甘","汁","买","法","圆","切","怎","选","最","抱","拿","办"],
      writeChars: ["生","果","汁","买","斤","它","办","法","看"],
      radicals: [
        { name:"舌字旁", form:"舌", examples:["甜"] },
        { name:"口字旁", form:"口", examples:["喝","味"] },
        { name:"力字旁", form:"力", examples:["办","加"] }
      ],
      strokeFocus: "横折钩（办）",
      strokeRule: "先中间后两边（如：办、小）"
    },
    {
      no: 16, chinese: "十六", title: "家庭 / 家务",
      words: [
        ["打扫","dǎsǎo","sweep, clean"],["窗户","chuānghu","window"],
        ["桌子","zhuōzi","table"],["特别","tèbié","special"],
        ["兄弟","xiōngdì","brothers"],["房间","fángjiān","room"],
        ["干净","gānjìng","clean"],["叔叔","shūshu","uncle"],
        ["听话","tīnghuà","obedient"],["响声","xiǎngshēng","sound"]
      ],
      recognizeChars: ["扫","写","户","桌","完","特","兄","房","阿","叔","会","打","听","啊","声","进","净","谁"],
      writeChars: ["父","母","她","他","会","你","们","爸","妈","打"],
      radicals: [
        { name:"提手旁", form:"扌", examples:["扫","打"] },
        { name:"宝盖头", form:"宀", examples:["完","家","室"] },
        { name:"口字旁", form:"口", examples:["听","啊"] }
      ],
      strokeFocus: "竖弯钩",
      strokeRule: "从上到下（如：完、兄）"
    },
    {
      no: 17, chinese: "十七", title: "节日 / 庆祝",
      words: [
        ["昨晚","zuówǎn","last night"],["星星","xīngxing","stars"],
        ["明天","míngtiān","tomorrow"],["庆祝","qìngzhù","celebrate"],
        ["节目","jiémù","programme"],["爱护","àihù","cherish"],
        ["因为","yīnwèi","because"],["快乐","kuàilè","happy"],
        ["讲台","jiǎngtái","podium"],["故事","gùshi","story"],
        ["每当","měidāng","whenever"],["儿童","értóng","children"]
      ],
      recognizeChars: ["昨","晚","星","明","庆","祝","节","爱","给","因","为","乐","课","台","讲","故","每","童"],
      writeChars: ["昨","明","给","快","乐","没","有","这","老","师","每"],
      radicals: [
        { name:"日字旁", form:"日", examples:["昨","明","晚"] },
        { name:"示字旁", form:"礻", examples:["祝"] },
        { name:"心字底", form:"心", examples:["爱","思"] }
      ],
      strokeFocus: "卧钩",
      strokeRule: "先外后内（如：因）"
    },
    {
      no: 18, chinese: "十八", title: "动物 / 身体部位",
      words: [
        ["兔子","tùzi","rabbit"],["尾巴","wěiba","tail"],
        ["短期","duǎnqī","short-term"],["眼睛","yǎnjing","eyes"],
        ["皮带","pídài","belt"],["爪子","zhǎozi","claw, paw"],
        ["尖叫","jiānjiào","scream"],["动物","dòngwù","animal"],
        ["老虎","lǎohǔ","tiger"],["狮子","shīzi","lion"],
        ["园丁","yuándīng","gardener"],["孩子","háizi","child"]
      ],
      recognizeChars: ["兔","尾","短","眼","睛","爪","尖","物","虎","狮","园","期","带","黑","站","叫","认","话","再","孩"],
      writeChars: ["爪","尖","气","玩","我","弟","妹","站","叫","再"],
      radicals: [
        { name:"目字旁", form:"目", examples:["眼","睛"] },
        { name:"反犬旁", form:"犭", examples:["狮","物"] },
        { name:"口字旁", form:"口", examples:["叫","吐"] }
      ],
      strokeFocus: "撇",
      strokeRule: "从左到右（如：眼、睛）"
    },
    {
      no: 19, chinese: "十九", title: "游玩 / 场所",
      words: [
        ["组织","zǔzhī","organise"],["屋子","wūzi","room"],
        ["公共","gōnggòng","public"],["学校","xuéxiào","school"],
        ["广场","guǎngchǎng","square, plaza"],["商店","shāngdiàn","shop"],
        ["伙伴","huǒbàn","partner"],["楼梯","lóutī","stairs"],
        ["扶手","fúshǒu","handrail"],["高兴","gāoxìng","happy"],
        ["游戏","yóuxì","game"]
      ],
      recognizeChars: ["组","屋","球","公","步","校","场","习","商","店","伙","伴","梯","扶","游","拍","兴","戏"],
      writeChars: ["公","园","姐","哥","习","心","起","到","高","兴"],
      radicals: [
        { name:"绞丝旁", form:"纟", examples:["组"] },
        { name:"木字旁", form:"木", examples:["校","梯"] },
        { name:"单人旁", form:"亻", examples:["伙","伴"] }
      ],
      strokeFocus: "提",
      strokeRule: "先中间后两边（如：兴）"
    }
  ]
};

/* Master character dictionary: pinyin + English gloss for every
   character used above (recognizeChars ∪ writeChars) */
const CHAR_INFO = {
  "甲":["jiǎ","first; armour"], "丁":["dīng","a nail; (surname)"], "前":["qián","front"],
  "后":["hòu","back, behind"], "左":["zuǒ","left"], "右":["yòu","right"],
  "中":["zhōng","middle"], "间":["jiān","between; room"], "边":["biān","side"],
  "同":["tóng","same"], "学":["xué","study"], "朋":["péng","friend"], "友":["yǒu","friend"],
  "坐":["zuò","sit"], "高":["gāo","tall"], "发":["fā","send out; happen"], "直":["zhí","straight"],
  "起":["qǐ","to rise"], "回":["huí","return"], "周":["zhōu","week"], "末":["mò","end"],
  "面":["miàn","face; side"], "的":["de","(possessive particle)"], "画":["huà","draw; picture"],

  "鸡":["jī","chicken"], "饭":["fàn","cooked rice; meal"], "鸭":["yā","duck"], "肉":["ròu","meat"],
  "元":["yuán","dollar; origin"], "饿":["è","hungry"], "饱":["bǎo","full (after eating)"],
  "饼":["bǐng","cake, biscuit"], "干":["gān","dry"], "狗":["gǒu","dog"], "喜":["xǐ","happy; to like"],
  "欢":["huān","joyful"], "猫":["māo","cat"], "歌":["gē","song"], "唱":["chàng","to sing"],
  "青":["qīng","green/blue"], "菜":["cài","vegetable"], "汤":["tāng","soup"], "蛋":["dàn","egg"],
  "香":["xiāng","fragrant"], "包":["bāo","bun; to wrap"], "半":["bàn","half"], "虫":["chóng","insect"],
  "今":["jīn","now, today"], "吃":["chī","eat"], "米":["mǐ","rice"], "豆":["dòu","bean"],

  "用":["yòng","to use"], "刷":["shuā","brush"], "巾":["jīn","towel, cloth"], "抹":["mǒ","to wipe"],
  "洗":["xǐ","to wash"], "要":["yào","want, need"], "脸":["liǎn","face"], "放":["fàng","to put; release"],
  "冲":["chōng","to rinse"], "凉":["liáng","cool"], "东":["dōng","east"], "西":["xī","west"],
  "到":["dào","to arrive"], "先":["xiān","first"], "请":["qǐng","please"], "很":["hěn","very"],
  "泡":["pào","to soak; bubble"], "变":["biàn","to change"], "谢":["xiè","to thank"], "牙":["yá","tooth"],
  "以":["yǐ","by means of"], "雨":["yǔ","rain"], "马":["mǎ","horse"], "点":["diǎn","point; dot; o'clock"],

  "这":["zhè","this"], "双":["shuāng","pair"], "袜":["wà","socks"], "那":["nà","that"],
  "皮":["pí","skin, leather"], "鞋":["xié","shoe"], "件":["jiàn","item (measure word)"],
  "服":["fú","clothes"], "被":["bèi","quilt; (passive marker)"], "还":["hái","still, also"],
  "色":["sè","colour"], "红":["hóng","red"], "都":["dōu","all"], "动":["dòng","move"],
  "作":["zuò","to do, make"], "快":["kuài","fast"], "收":["shōu","receive, collect"],
  "拾":["shí","to pick up"], "穿":["chuān","to wear"], "事":["shì","matter, thing"],
  "做":["zuò","to do, make"], "是":["shì","to be"], "衣":["yī","clothes"], "和":["hé","and"],
  "里":["lǐ","inside"], "尺":["chǐ","ruler; foot (unit)"], "自":["zì","self"], "己":["jǐ","self"],
  "好":["hǎo","good"],

  "甜":["tián","sweet"], "苦":["kǔ","bitter"], "臭":["chòu","smelly"], "生":["shēng","raw; life"],
  "重":["zhòng","heavy; important"], "喝":["hē","to drink"], "甘":["gān","sweet; willing"],
  "汁":["zhī","juice"], "买":["mǎi","to buy"], "法":["fǎ","method, law"], "圆":["yuán","round"],
  "切":["qiè","to cut"], "怎":["zěn","how"], "选":["xuǎn","to choose"], "最":["zuì","most"],
  "抱":["bào","to hug"], "拿":["ná","to take, hold"], "办":["bàn","to do, handle"], "果":["guǒ","fruit"],
  "斤":["jīn","catty (unit of weight)"], "它":["tā","it"], "看":["kàn","to look, see"],

  "扫":["sǎo","to sweep"], "写":["xiě","to write"], "户":["hù","household; door"], "桌":["zhuō","table"],
  "完":["wán","to finish"], "特":["tè","special"], "兄":["xiōng","elder brother"], "房":["fáng","room, house"],
  "阿":["ā","(name prefix)"], "叔":["shū","uncle"], "会":["huì","can; meeting"], "打":["dǎ","to hit; to play"],
  "听":["tīng","to listen"], "啊":["a","(exclamation particle)"], "声":["shēng","sound"], "进":["jìn","to enter"],
  "净":["jìng","clean"], "谁":["shéi","who"], "父":["fù","father"], "母":["mǔ","mother"],
  "她":["tā","she"], "他":["tā","he"], "你":["nǐ","you"], "们":["men","(plural marker)"],
  "爸":["bà","dad"], "妈":["mā","mom"],

  "昨":["zuó","yesterday"], "晚":["wǎn","evening; late"], "星":["xīng","star"], "明":["míng","bright; next"],
  "庆":["qìng","to celebrate"], "祝":["zhù","to wish, bless"], "节":["jié","festival"], "爱":["ài","love"],
  "给":["gěi","to give"], "因":["yīn","because"], "为":["wèi","for, because"], "乐":["lè","happy"],
  "课":["kè","lesson"], "台":["tái","platform, stage"], "讲":["jiǎng","to speak"], "故":["gù","reason; old"],
  "每":["měi","every"], "童":["tóng","child"], "没":["méi","not have"], "有":["yǒu","to have"],
  "老":["lǎo","old"], "师":["shī","teacher"],

  "兔":["tù","rabbit"], "尾":["wěi","tail"], "短":["duǎn","short"], "眼":["yǎn","eye"],
  "睛":["jīng","eyeball"], "爪":["zhǎo","claw"], "尖":["jiān","sharp, pointed"], "物":["wù","thing"],
  "虎":["hǔ","tiger"], "狮":["shī","lion"], "园":["yuán","garden"], "期":["qī","period, date"],
  "带":["dài","to bring; belt"], "黑":["hēi","black"], "站":["zhàn","to stand; station"],
  "叫":["jiào","to call, shout"], "认":["rèn","to recognise"], "话":["huà","speech, words"],
  "再":["zài","again"], "孩":["hái","child"], "气":["qì","air, gas"], "玩":["wán","to play"],
  "我":["wǒ","I, me"], "弟":["dì","younger brother"], "妹":["mèi","younger sister"],

  "组":["zǔ","group"], "屋":["wū","room, house"], "球":["qiú","ball"], "公":["gōng","public"],
  "步":["bù","step"], "校":["xiào","school"], "场":["chǎng","field, venue"], "习":["xí","to practice"],
  "商":["shāng","commerce"], "店":["diàn","shop"], "伙":["huǒ","partner"], "伴":["bàn","companion"],
  "梯":["tī","ladder, stairs"], "扶":["fú","to support"], "游":["yóu","to swim; to tour"],
  "拍":["pāi","to pat, clap"], "兴":["xìng","interest, mood"], "戏":["xì","play, drama"],
  "姐":["jiě","elder sister"], "哥":["gē","elder brother"], "心":["xīn","heart"]
};

/* ============================================================
   华文小乐园 — custom SVG icon library
   Keys = the Chinese word/character they illustrate.
   Icons whose class list includes "icon-anim" have a matching
   @keyframes rule in style.css (verbs get motion).
   ============================================================ */

const ICONS = {
  "鸡蛋": `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="26" ry="34" fill="#FFF3D6" stroke="var(--ink)" stroke-width="3"/><ellipse cx="42" cy="46" rx="7" ry="9" fill="#FFFFFF" opacity=".8"/></svg>`,

  "米饭": `<svg viewBox="0 0 100 100"><path d="M20 55 Q50 40 80 55 L74 78 Q50 88 26 78 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/><ellipse cx="42" cy="52" rx="4" ry="6" fill="#fff"/><ellipse cx="55" cy="48" rx="4" ry="6" fill="#fff"/><ellipse cx="63" cy="55" rx="4" ry="6" fill="#fff"/><ellipse cx="48" cy="58" rx="4" ry="6" fill="#fff"/></svg>`,

  "鸭子": `<svg viewBox="0 0 100 100"><ellipse cx="45" cy="62" rx="30" ry="22" fill="#FFF3D6" stroke="var(--ink)" stroke-width="3"/><circle cx="68" cy="40" r="16" fill="#FFF3D6" stroke="var(--ink)" stroke-width="3"/><path d="M82 40 L94 36 L94 46 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="2"/><circle cx="72" cy="36" r="2.5" fill="var(--ink)"/></svg>`,

  "小狗": `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="28" fill="#E9C9A0" stroke="var(--ink)" stroke-width="3"/><path d="M26 40 Q14 30 20 55 Q26 55 30 46Z" fill="#C99B65" stroke="var(--ink)" stroke-width="2.5"/><path d="M74 40 Q86 30 80 55 Q74 55 70 46Z" fill="#C99B65" stroke="var(--ink)" stroke-width="2.5"/><circle cx="40" cy="52" r="3" fill="var(--ink)"/><circle cx="60" cy="52" r="3" fill="var(--ink)"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="var(--ink)"/></svg>`,

  "唱歌": `<svg viewBox="0 0 100 100" class="icon-anim icon-anim-bounce"><circle cx="42" cy="42" r="20" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><ellipse cx="42" cy="52" rx="7" ry="5" fill="var(--red)"/><path d="M66 30 Q80 20 84 34 Q88 46 74 46 Q78 34 66 34Z" fill="var(--green)" stroke="var(--ink)" stroke-width="2.5" class="icon-note"/></svg>`,

  "青菜": `<svg viewBox="0 0 100 100"><path d="M50 90 Q46 60 50 20 Q58 45 60 20 Q70 50 62 90 Z" fill="var(--green)" stroke="var(--ink)" stroke-width="3"/><path d="M50 90 Q40 60 30 20 Q40 48 44 20" fill="var(--green)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "刷牙": `<svg viewBox="0 0 100 100"><path d="M35 60 Q50 40 65 60 Q65 78 50 78 Q35 78 35 60Z" fill="#fff" stroke="var(--ink)" stroke-width="3"/><rect x="46" y="18" width="8" height="30" rx="3" fill="var(--sky)" stroke="var(--ink)" stroke-width="2.5" class="icon-brush"/><rect x="42" y="14" width="16" height="8" rx="2" fill="var(--ink)" class="icon-brush"/></svg>`,

  "洗脸": `<svg viewBox="0 0 100 100"><circle cx="50" cy="46" r="24" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><circle cx="42" cy="44" r="2.5" fill="var(--ink)"/><circle cx="58" cy="44" r="2.5" fill="var(--ink)"/><path d="M44 56 Q50 60 56 56" stroke="var(--ink)" stroke-width="2.5" fill="none"/><path class="icon-anim icon-drop" d="M50 70 Q54 78 50 84 Q46 78 50 70Z" fill="var(--sky)"/></svg>`,

  "毛巾": `<svg viewBox="0 0 100 100"><rect x="22" y="30" width="56" height="42" rx="4" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/><rect x="22" y="38" width="56" height="6" fill="#fff" opacity=".7"/><rect x="22" y="54" width="56" height="6" fill="#fff" opacity=".7"/></svg>`,

  "袜子": `<svg viewBox="0 0 100 100"><path d="M40 15 h20 v35 q0 8 12 12 q10 4 10 18 q0 8 -10 8 h-32 q-8 0-8-10 v-63Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/><rect x="40" y="15" width="20" height="10" fill="#fff" opacity=".5"/></svg>`,

  "皮鞋": `<svg viewBox="0 0 100 100"><path d="M18 68 Q18 50 34 48 L60 48 Q70 48 78 58 L86 66 Q88 72 80 72 L20 72 Q16 72 18 68Z" fill="#8B5A2B" stroke="var(--ink)" stroke-width="3"/><path d="M34 48 L34 60" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "衣服": `<svg viewBox="0 0 100 100"><path d="M38 22 L50 30 L62 22 L78 34 L70 46 L64 42 L64 80 L36 80 L36 42 L30 46 L22 34Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "被子": `<svg viewBox="0 0 100 100"><rect x="16" y="30" width="68" height="46" rx="6" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><path d="M16 46 h68 M16 60 h68" stroke="#fff" stroke-width="4" opacity=".6"/></svg>`,

  "红色": `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "果汁": `<svg viewBox="0 0 100 100"><path d="M34 24 h32 l-6 56 q-1 8-10 8 q-9 0-10-8 Z" fill="#FFE9A8" stroke="var(--ink)" stroke-width="3"/><rect x="46" y="10" width="4" height="20" fill="var(--sky)" stroke="var(--ink)" stroke-width="1.5"/></svg>`,

  "圆圈": `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="var(--green)" stroke-width="7"/></svg>`,

  "打扫": `<svg viewBox="0 0 100 100" class="icon-anim icon-sweep"><rect x="47" y="16" width="6" height="46" fill="#B08347" stroke="var(--ink)" stroke-width="2"/><path d="M30 60 L70 60 L62 84 L38 84 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "窗户": `<svg viewBox="0 0 100 100"><rect x="18" y="18" width="64" height="64" rx="4" fill="var(--sky)" opacity=".35" stroke="var(--ink)" stroke-width="3"/><path d="M50 18 v64 M18 50 h64" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "桌子": `<svg viewBox="0 0 100 100"><rect x="14" y="34" width="72" height="8" fill="#B08347" stroke="var(--ink)" stroke-width="2.5"/><rect x="20" y="42" width="6" height="36" fill="#8B5A2B" stroke="var(--ink)" stroke-width="2"/><rect x="74" y="42" width="6" height="36" fill="#8B5A2B" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "听话": `<svg viewBox="0 0 100 100" class="icon-anim"><path d="M40 30 Q20 30 24 55 Q26 74 44 74 Q46 60 40 30Z" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><path class="icon-wave" d="M56 40 Q66 50 56 62" stroke="var(--green)" stroke-width="4" fill="none" stroke-linecap="round"/><path class="icon-wave icon-wave2" d="M66 34 Q82 50 66 68" stroke="var(--green)" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,

  "星星": `<svg viewBox="0 0 100 100" class="icon-anim icon-twinkle"><path d="M50 12 L59 38 L86 38 L64 54 L72 80 L50 64 L28 80 L36 54 L14 38 L41 38Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "明天": `<svg viewBox="0 0 100 100"><circle cx="38" cy="50" r="22" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><path d="M64 30 Q78 34 78 50 Q78 66 64 70 Q74 60 74 50 Q74 40 64 30Z" fill="#6A6FB0" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "庆祝": `<svg viewBox="0 0 100 100" class="icon-anim icon-confetti"><rect x="20" y="20" width="8" height="8" fill="var(--red)"/><rect x="70" y="26" width="8" height="8" fill="var(--gold)"/><rect x="46" y="14" width="8" height="8" fill="var(--sky)"/><rect x="30" y="60" width="8" height="8" fill="var(--gold)"/><rect x="64" y="64" width="8" height="8" fill="var(--red)"/><path d="M50 40 L38 84 L62 84 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="2.5"/></svg>`,

  "故事": `<svg viewBox="0 0 100 100"><path d="M50 26 Q30 18 16 24 V76 Q30 70 50 78 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/><path d="M50 26 Q70 18 84 24 V76 Q70 70 50 78 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "兔子": `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="24" ry="20" fill="#fff" stroke="var(--ink)" stroke-width="3"/><ellipse cx="38" cy="24" rx="7" ry="20" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><ellipse cx="60" cy="24" rx="7" ry="20" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><circle cx="42" cy="58" r="2.5" fill="var(--ink)"/><circle cx="58" cy="58" r="2.5" fill="var(--ink)"/><ellipse cx="50" cy="68" rx="4" ry="3" fill="var(--red)"/></svg>`,

  "眼睛": `<svg viewBox="0 0 100 100" class="icon-anim icon-blink"><path d="M12 50 Q50 20 88 50 Q50 80 12 50Z" fill="#fff" stroke="var(--ink)" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="#6A6FB0" stroke="var(--ink)" stroke-width="2.5"/><circle cx="50" cy="50" r="6" fill="var(--ink)"/></svg>`,

  "老虎": `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="30" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><path d="M28 30 L34 44 M72 30 L66 44 M40 22 L42 38 M60 22 L58 38" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="50" r="3" fill="var(--ink)"/><circle cx="60" cy="50" r="3" fill="var(--ink)"/><ellipse cx="50" cy="62" rx="6" ry="4" fill="var(--red)"/></svg>`,

  "狮子": `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="18" fill="#E9C9A0" stroke="var(--ink)" stroke-width="3"/><circle cx="50" cy="52" r="30" fill="none" stroke="var(--gold)" stroke-width="10" stroke-dasharray="6 6"/><circle cx="42" cy="50" r="2.5" fill="var(--ink)"/><circle cx="58" cy="50" r="2.5" fill="var(--ink)"/><ellipse cx="50" cy="60" rx="5" ry="3" fill="var(--ink)"/></svg>`,

  "孩子": `<svg viewBox="0 0 100 100"><circle cx="50" cy="34" r="16" fill="#FFE1C4" stroke="var(--ink)" stroke-width="3"/><path d="M32 90 Q32 58 50 58 Q68 58 68 90Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "学校": `<svg viewBox="0 0 100 100"><rect x="20" y="42" width="60" height="42" fill="#F4E1C1" stroke="var(--ink)" stroke-width="3"/><path d="M14 42 L50 16 L86 42Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/><rect x="44" y="60" width="12" height="24" fill="var(--sky)" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "商店": `<svg viewBox="0 0 100 100"><rect x="18" y="42" width="64" height="40" fill="#fff" stroke="var(--ink)" stroke-width="3"/><path d="M14 42 L26 20 L74 20 L86 42Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/><rect x="42" y="58" width="16" height="24" fill="var(--gold)" stroke="var(--ink)" stroke-width="2"/></svg>`,

  "楼梯": `<svg viewBox="0 0 100 100"><path d="M14 84 h16 v-16 h16 v-16 h16 v-16 h16 v-16 h16 v64 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="3"/></svg>`,

  "高兴": `<svg viewBox="0 0 100 100" class="icon-anim icon-bounce"><circle cx="50" cy="50" r="30" fill="var(--gold)" stroke="var(--ink)" stroke-width="3"/><circle cx="40" cy="44" r="3" fill="var(--ink)"/><circle cx="60" cy="44" r="3" fill="var(--ink)"/><path d="M36 58 Q50 72 64 58" stroke="var(--ink)" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`,

  "游戏": `<svg viewBox="0 0 100 100"><rect x="18" y="34" width="64" height="34" rx="14" fill="#6A6FB0" stroke="var(--ink)" stroke-width="3"/><circle cx="34" cy="51" r="4" fill="#fff"/><circle cx="46" cy="51" r="4" fill="#fff"/><circle cx="40" cy="45" r="4" fill="#fff"/><circle cx="40" cy="57" r="4" fill="#fff"/><circle cx="66" cy="45" r="4" fill="var(--gold)"/><circle cx="66" cy="57" r="4" fill="var(--red)"/></svg>`,

  "喜欢": `<svg viewBox="0 0 100 100" class="icon-anim icon-bounce"><path d="M50 84 C10 58 18 24 40 24 C48 24 50 32 50 32 C50 32 52 24 60 24 C82 24 90 58 50 84Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3"/></svg>`
};
