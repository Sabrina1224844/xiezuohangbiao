/* =====================================================
   写作航标 · 主逻辑
   纯前端实现，全部数据保存在浏览器 localStorage。
   localStorage 键：
     wbx_active  当前默认学习板块 key
     wbx_libs    三个板块各自独立的学习数据（互不影响）
     wbx_drafts  作文草稿数组
     wbx_favs    草稿箱收藏（素材快照，与复习队列独立）
   语料数组（js/data.js 组装）：WORDS_BANK / WRITING_BANK / XUEXIE_BANK
   模板数据（js/templates.js）：TPL_COMMON / TPL_GENRES
   ===================================================== */

const App = (() => {
'use strict';

/* ---------------- 基础工具 ---------------- */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const todayStr = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD（本地时区）
const dateStr = ts => { const d = new Date(ts); const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
const tomorrowStr = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toLocaleDateString('sv-SE'); };
const fmtTime = ts => {
  const d = new Date(ts), p = n => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

let toastTimer = null;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------------- Hero 转场封装 ----------------
   基于 View Transitions API，不支持时自动降级为直接切换。
   注意：转场期间源/目标元素不能同名（否则形变被跳过），
   源名在 mutate 前清除，目标名在 mutate 后设置。 */
function heroSwap(mutate, sourceEl, targetEl){
  const canVT = document.startViewTransition &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanup = () => {
    if (sourceEl) sourceEl.style.viewTransitionName = '';
    if (targetEl) targetEl.style.viewTransitionName = '';
  };
  if (canVT){
    document.startViewTransition(() => {
      if (sourceEl) sourceEl.style.viewTransitionName = '';
      mutate();
      if (targetEl) targetEl.style.viewTransitionName = 'hero-card';
    }).finished.finally(cleanup);
  } else {
    mutate();
  }
}

/* ---------------- 三大板块定义 ----------------
   bank() 返回语料数组；换语料只需改 data.js */
const LIBS = {
  words:   { name:'背单词',       desc:'高考·四级写作词汇',     bank: () => WORDS_BANK },
  writing: { name:'应用文模板',   desc:'19类体裁·万能句式',     bank: () => WRITING_BANK },
  xuexie:  { name:'读后续写素材', desc:'情绪/环境/动作描写句式', bank: () => XUEXIE_BANK }
};
const LIB_KEYS = Object.keys(LIBS);
const activeLibKey = () => store.get('wbx_active', null);

/* ---------------- 板块学习数据（各库独立） ----------------
   结构：{ daily, source, today, newDone, reviewDone, totalNew, totalReview, items:{id:{...}} }
   source 学习范围：'all' 全部素材 | 'fav' 仅草稿箱收藏
   item 记录字段：
     status    'known' 已记住 | 'review' 待复习（学习时标记）
     addedAt   首次加入时间戳
     learnDate 学日 YYYY-MM-DD（当天完成学习）
     dueDate   进入复习队列日期：学习日+1天（次日自动入队）
     qState    'pending' 在队列 | 'done' 已完成复习移出队列
   规则：只有 dueDate<=today 且 qState=pending 的条目才算「待复习」，
        未完成会一直留在队列；草稿箱收藏与队列完全无关。 */
function libState(key){
  const libs = store.get('wbx_libs', {});
  const st = libs[key] || { daily:10, source:'all', today:todayStr(), newDone:0, reviewDone:0, totalNew:0, totalReview:0, items:{} };
  if (st.today !== todayStr()){ st.today = todayStr(); st.newDone = 0; st.reviewDone = 0; } // 跨天重置今日进度
  if (!st.source) st.source = 'all';
  // 旧数据迁移：补齐队列字段
  Object.values(st.items).forEach(rec => {
    if (!rec.learnDate) rec.learnDate = dateStr(rec.addedAt || Date.now());
    if (!rec.dueDate)   rec.dueDate   = rec.learnDate;
    if (!rec.qState)    rec.qState    = rec.status === 'review' ? 'pending' : 'done';
  });
  return st;
}
function saveLibState(key, st){
  const libs = store.get('wbx_libs', {});
  libs[key] = st; store.set('wbx_libs', libs);
}
/* 待复习 = 已到入队日期 且 尚未完成复习 */
const pendingReviewCount = st =>
  Object.values(st.items).filter(i => i.qState === 'pending' && i.dueDate <= todayStr()).length;
const bankItem = (cat, id) => LIBS[cat].bank().find(x => x.id === id);

/* ---------------- 视图切换 ---------------- */
const VIEW_IDS = { home:'view-home', plaza:'view-plaza', drafts:'view-drafts', mine:'view-mine',
                   study:'view-study', review:'view-review', essays:'view-essays', editor:'view-editor',
                   word:'view-word', templates:'view-templates', xuexie:'view-xuexie' };
let currentView = 'home';
function showView(name){
  currentView = name;
  Object.entries(VIEW_IDS).forEach(([k, id]) => $('#' + id).classList.toggle('active', k === name));
  // 子页面（无底部Tab栏）：学习、复习队列、作文草稿、编辑器、单词详情、模板库
  $('#phone').dataset.sub = ['study', 'review', 'essays', 'editor', 'word', 'templates', 'xuexie'].includes(name) ? '1' : '0';
  if (name === 'home')      renderHome();
  if (name === 'drafts')    renderFavs();
  if (name === 'review')    renderReview();
  if (name === 'essays')    renderDrafts();
  if (name === 'mine')      renderMine();
  if (name === 'templates') renderTplView();
  if (name === 'xuexie')    renderXxView();
  $('#' + VIEW_IDS[name]).scrollTop = 0;
}
function switchTab(name){
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  heroSwap(() => showView(name));
}
const goHome = () => switchTab('home');

/* ================= 首页 ================= */
let exampleItem = null;
function shuffleExample(){
  const bank = LIBS.xuexie.bank();
  exampleItem = bank.length ? bank[Math.floor(Math.random() * bank.length)] : null;
  $('#exampleEn').textContent     = exampleItem ? exampleItem.en : '语料库暂无内容，等待导入素材…';
  $('#exampleCn').textContent     = exampleItem ? exampleItem.cn : '';
  $('#exampleScenes').textContent = exampleItem ? exampleItem.scenes.join(' ｜ ') : '—';
  updateExampleStar();
}
function renderHome(){
  const key = activeLibKey();
  const st  = key ? libState(key) : null;
  const daily   = st ? st.daily : 10;
  const pending = st ? pendingReviewCount(st) : 0;
  const newDone = st ? st.newDone : 0;
  const revDone = st ? st.reviewDone : 0;

  $('#studyDone').textContent  = newDone;
  $('#studyTotal').textContent = daily;
  $('#studyBar').style.width   = daily ? Math.min(100, newDone / daily * 100) + '%' : '0%';

  $('#reviewDone').textContent  = revDone;
  $('#reviewTotal').textContent = pending;
  $('#reviewBar').style.width   = pending ? Math.min(100, revDone / pending * 100) + '%' : '0%';
}
/* 点击首页例句卡片：Hero 放大进入详情 */
function openExampleDetail(){
  if (!exampleItem){ toast('语料库暂无内容，等待导入素材'); return; }
  heroSwap(() => openDetail('xuexie', exampleItem.id), $('#exampleCard'));
}

/* ================= 板块选择弹窗（含学习范围） ================= */
let pickerKey = null, pickerDaily = 10, pickerSrc = 'all', pendingMode = 'study';
function openPicker(mode){
  pendingMode = mode || 'study';
  pickerKey   = activeLibKey() || 'words';
  const st0   = libState(pickerKey);
  pickerDaily = st0.daily;
  pickerSrc   = st0.source;
  renderPicker();
  $('#modalPicker').classList.add('open');
}
function renderPicker(){
  $('#pickerLibs').innerHTML = LIB_KEYS.map(k => `
    <button class="lib-opt ${k === pickerKey ? 'on' : ''}" onclick="App.pickLib('${k}')">
      <span class="lib-name">${LIBS[k].name}<small>${LIBS[k].desc}</small></span>
      <span class="radio"></span>
    </button>`).join('');
  $$('#srcSeg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.s === pickerSrc));
  $('#dailyVal').textContent = pickerDaily;
  $$('#dailyChips .chip').forEach(c => c.classList.toggle('on', +c.dataset.v === pickerDaily));
}
function pickLib(k){
  pickerKey = k;
  const st = libState(k);
  pickerDaily = st.daily; pickerSrc = st.source;
  renderPicker();
}
const setSrc = s => { pickerSrc = s; renderPicker(); };
function stepDaily(d){ pickerDaily = Math.min(100, Math.max(5, pickerDaily + d)); renderPicker(); } // 仅 ±5 步进
function setDaily(v){ pickerDaily = v; renderPicker(); }
function confirmPicker(){
  const st = libState(pickerKey);
  st.daily  = Math.round(pickerDaily / 5) * 5; // 双保险：强制 5 的倍数
  st.source = pickerSrc;
  saveLibState(pickerKey, st);
  store.set('wbx_active', pickerKey);
  closeModal('modalPicker');
  enterStudy(pendingMode);
}
const closeModal = id => $('#' + id).classList.remove('open');

/* ================= 学习 / 复习页 ================= */
let session = null; // { mode:'study'|'review', key, queue:[id], idx }

function buildSession(mode, key){
  const bank = LIBS[key].bank(), st = libState(key);
  const today = todayStr();
  let queue;
  if (mode === 'study'){
    const remain = Math.max(0, st.daily - st.newDone);          // 今日剩余新素材额度
    let pool = bank.filter(x => !st.items[x.id]);
    if (st.source === 'fav'){
      /* 学习范围=我的收藏：仅从草稿箱该板块收藏中抽取 */
      const favIds = new Set(getFavs().filter(f => f.cat === key).map(f => f.id));
      pool = pool.filter(x => favIds.has(x.id));
    }
    queue = pool.slice(0, remain).map(x => x.id);
  } else {
    // 复习队列：已到入队日期（学习次日或手动加入）且未完成复习的条目
    queue = Object.entries(st.items)
      .filter(([, v]) => v.qState === 'pending' && v.dueDate <= today)
      .map(([id]) => id);
  }
  return { mode, key, queue, idx:0 };
}

function enterStudy(mode, sourceEl, forceKey){
  const key = forceKey || activeLibKey();
  if (!key){ openPicker(mode); return; }   // 首次进入：先弹板块选择
  session = buildSession(mode, key);
  $('#studyTitle').textContent = (mode === 'study' ? '学习模式 · ' : '复习模式 · ') + LIBS[key].name;
  heroSwap(() => { showView('study'); renderStudy(); }, sourceEl);
}
const startStudy  = () => enterStudy('study',  $('#taskCard'));
const startReview = () => enterStudy('review', $('#taskCard'));
const goReview    = () => enterStudy('review');
const openReview  = () => { session = null; heroSwap(() => showView('review')); }; // 打开复习队列页

function renderStudy(){
  const wrap = $('#studyBody');
  const key = session ? session.key : activeLibKey();
  if (!key){ wrap.innerHTML = emptyCard('请先选择学习板块', '<button class="btn" style="margin-top:18px" onclick="App.openPicker()">选择板块</button>'); return; }
  if (!LIBS[key].bank().length){
    wrap.innerHTML = emptyCard('「' + LIBS[key].name + '」语料库为空', '素材内容等待导入，导入后即可开始学习。'); return;
  }
  if (!session){ enterStudy('study'); return; }

  const total = session.queue.length;
  const prog = `
    <div class="card study-top">
      <div class="task-row">
        <span class="task-name">${session.mode === 'study' ? '今日新学进度' : '今日复习进度'}</span>
        <span class="task-num"><b>${Math.min(session.idx, total)}</b> / ${total}</span>
      </div>
      <div class="bar"><i style="width:${total ? session.idx / total * 100 : 0}%"></i></div>
    </div>`;

  if (session.idx >= total){ wrap.innerHTML = prog + doneHTML(); return; }

  const it = bankItem(key, session.queue[session.idx]);
  wrap.innerHTML = prog + flashHTML(key, it) + `
    <div class="study-actions">
      <button class="btn ghost" onclick="App.mark(false)">待复习</button>
      <button class="btn" onclick="App.mark(true)">记住</button>
    </div>
    <p class="study-hint">点击卡片可展开 / 收起译文与详情</p>`;
}

/* 记忆卡片：正面素材 + 可展开译文与详情 */
function flashHTML(key, it){
  let front = '', secret = '';
  if (key === 'words'){
    front  = `<span class="badge">${esc(wordLevel(it))}</span><h3 class="flash-word">${esc(it.word)}</h3>`;
    secret = `<p class="detail-meaning">${esc(it.meaning)}</p>` + wordSectionsHTML(it);
  } else if (key === 'writing'){
    front  = `<span class="badge orange">${esc(it.genre)} · ${esc(it.partName)}</span>
              <p class="detail-en" style="margin-top:16px">${esc(it.en)}</p>`;
    secret = `<p class="detail-cn">${esc(it.cn)}</p>`;
  } else {
    front  = `<span class="badge">读后续写</span><p class="detail-en" style="margin-top:14px">${esc(it.en)}</p>`;
    secret = `<p class="detail-cn">${esc(it.cn)}</p>
              ${it.tpl ? `<p class="detail-tpl"><b>结构模板</b><i>${esc(it.tpl)}</i></p>` : ''}
              <p class="detail-scenes">适用场景：${(it.scenes || []).map(s => `<i>${esc(s)}</i>`).join('')}</p>`;
  }
  return `<article class="card flash" id="flashCard" onclick="App.toggleFlash(this)">
    <button class="icon-btn star-btn flash-star ${isFav(key, it.id) ? 'on' : ''}" aria-label="收藏"
      onclick="event.stopPropagation();App.toggleFav('${key}','${it.id}',this)">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav(key, it.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8Z"/></svg>
    </button>
    <div class="flash-front">${front}<span class="flash-tap">点击卡片查看译文与详情</span></div>
    <div class="flash-secret"><div class="fs-inner">${secret}</div></div>
  </article>`;
}
const toggleFlash = el => el.classList.toggle('reveal');

/* 标记：known=记住 / review=待复习，并推进队列 */
function mark(known){
  if (!session || session.idx >= session.queue.length) return;
  const key = session.key, id = session.queue[session.idx];
  const st  = libState(key);
  const rec = st.items[id] || { status:'new', addedAt:Date.now() };
  rec.status = known ? 'known' : 'review';
  if (session.mode === 'study'){
    /* 新学素材：记下学日，次日自动进入复习队列（无论标记结果） */
    rec.learnDate = todayStr();
    rec.dueDate   = tomorrowStr();
    rec.qState    = 'pending';
    st.newDone++; st.totalNew++;
  } else {
    /* 复习：点「记住」完成本条并移出队列；点「待复习」继续留在队列 */
    if (known){ rec.qState = 'done'; rec.doneDate = todayStr(); }
    else      { rec.qState = 'pending'; }
    st.reviewDone++; st.totalReview++;
  }
  st.items[id] = rec;
  saveLibState(key, st);
  session.idx++;
  heroSwap(renderStudy);
}

function doneHTML(){
  const st  = libState(session.key);
  const total = session.queue.length;
  if (session.mode === 'study'){
    if (!total){
      const favMode = st.source === 'fav';
      return `<div class="card done-card">
        <h3>${favMode ? '收藏内容都已学完' : '今日学习已完成'}</h3>
        <p>${favMode ? '到素材广场继续收藏新素材，或把学习范围切回「全部素材」'
                       : '今日新学额度已用完，明天再来解锁新素材'}</p>
        <div class="study-actions">
          <button class="btn ghost" onclick="App.openPicker()">调整范围</button>
          <button class="btn" onclick="App.goReview()">去复习</button>
        </div>
      </div>`;
    }
    return `<div class="card done-card">
      <h3>今日新学已完成</h3>
      <p>已完成 ${st.newDone} / ${st.daily} 个新素材，去复习巩固一下吧</p>
      <button class="btn" onclick="App.goReview()">开始复习</button>
    </div>`;
  }
  if (!total){
    return `<div class="card done-card">
      <h3>暂无待复习素材</h3>
      <p>可先在首页学习新素材，或到素材广场把素材加入复习队列</p>
      <button class="btn" onclick="App.switchTab('plaza')">去素材广场</button>
    </div>`;
  }
  return `<div class="card done-card">
    <h3>复习完成</h3>
    <p>今日已复习 ${st.reviewDone} 条素材，明天继续加油</p>
    <button class="btn ghost" onclick="App.goHome()">返回首页</button>
  </div>`;
}

const emptyCard = (title, sub) =>
  `<div class="card done-card"><h3>${title}</h3><p>${sub}</p></div>`;

/* ================= 素材广场 ================= */
let plazaCat = 'words';
const PLAZA_PAGE = 80;   // 分页渲染：每次 80 条，避免大词库卡顿
let plazaPage = 1;

function setPlazaCat(k){
  if (k === 'writing'){ openTemplates(); return; } // 应用文模板 → 打开模板库浏览页
  if (k === 'xuexie'){ openXuexie(); return; }     // 读后续写 → 打开分类浏览页
  plazaCat = k;
  $$('#plazaSeg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.k === k));
  renderPlaza();
}
function renderPlaza(){
  plazaPage = 1;
  renderPlazaList();
}
function renderPlazaList(){
  const kw = ($('#searchInput').value || '').trim().toLowerCase();
  const bank = LIBS[plazaCat].bank();
  const list = kw ? bank.filter(it => (it._search || JSON.stringify(it).toLowerCase()).includes(kw)) : bank;
  const shown = list.slice(0, plazaPage * PLAZA_PAGE);
  $('#plazaList').innerHTML = shown.length
    ? shown.map(it => plazaCardHTML(plazaCat, it)).join('') +
      (list.length > shown.length
        ? `<button class="btn ghost more-btn" onclick="App.morePlaza()">显示更多（还有 ${list.length - shown.length} 条）</button>`
        : '')
    : `<div class="empty">${kw ? '未找到相关素材，换个关键词试试' : '该分类语料库为空，等待导入素材'}</div>`;
}
const morePlaza = () => { plazaPage++; renderPlazaList(); };

function plazaCardHTML(cat, it){
  let body = '';
  if (cat === 'words'){
    /* 紧凑单词卡：默认收起；点左侧单词 → 卡片内展开扩展板块（例句/替换词/词性转换/短语），
       右侧释义点击才显示；扩展内容懒渲染，展开状态记录在 openWordIds（收藏刷新后不收起） */
    const faved = isFav(cat, it.id);
    const open = openWordIds.has(it.id);
    return `<article class="card w-card">
      <div class="w-head">
        <span class="w-word" onclick="App.toggleWordExpand('${it.id}',this)">${esc(it.word)}</span>
        <div class="w-right" onclick="App.toggleMeaning(this)">
          <span class="w-mhint">点击显示释义</span>
          <span class="w-mtext">${esc(it.pos)} ${esc(it.meaning)}</span>
        </div>
        <button class="icon-btn star-btn w-star ${faved ? 'on' : ''}" aria-label="收藏"
          onclick="event.stopPropagation();App.toggleFav('${cat}','${it.id}',this)">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="${faved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8Z"/></svg>
        </button>
      </div>
      <div class="w-detail${open ? ' open' : ''}"${open ? ' data-ready="1"' : ''}><div class="w-detail-in">${open ? wordSectionsHTML(it, true) : ''}</div></div>
    </article>`;
  }
  /* 读后续写素材卡（不变） */
  body = `<p class="p-en" style="margin-top:0">${esc(it.en)}</p><p class="p-cn">${esc(it.cn)}</p>`;
  const faved = isFav(cat, it.id);
  return `<article class="card p-card" onclick="App.heroOpenDetail('${cat}','${it.id}',this)">
    <button class="icon-btn star-btn ${faved ? 'on' : ''}" aria-label="收藏"
      onclick="event.stopPropagation();App.toggleFav('${cat}','${it.id}',this)">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="${faved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8Z"/></svg>
    </button>
    ${body}
    <button class="btn small join-btn" onclick="event.stopPropagation();App.joinReview('${cat}','${it.id}')">加入复习</button>
  </article>`;
}
function heroOpenDetail(cat, id, el){
  el.style.viewTransitionName = 'hero-card';
  heroSwap(() => openDetail(cat, id), el);
}
/* 把素材加入对应板块的复习队列（手动加入：当天即生效） */
function joinReview(cat, id){
  const st = libState(cat);
  if (st.items[id] && st.items[id].qState !== 'done'){ toast('该素材已在复习队列中'); return; }
  st.items[id] = Object.assign(st.items[id] || {}, {
    status:'review', addedAt: Date.now(),
    learnDate: todayStr(), dueDate: todayStr(), qState:'pending' // 手动加入：立即入队
  });
  saveLibState(cat, st);
  toast('已加入「' + LIBS[cat].name + '」复习队列');
}

/* ================= 单词详情页 =================
   板块：释义 / 可替换词 / 常用例句 / 出彩例句 / 词性转换 / 常见短语 */
let wordBack = 'plaza'; // 返回目标视图
const wordLevel = it => it.level === 'core' ? '核心写作词'
                      : it.level === 'writing' ? '应用文高频词'
                      : (it.src === 'c4' ? '四级词汇' : '高考词汇');

/* 扩展板块（学习卡与详情页共用）
   compact=true：素材卡内嵌展开用，标题不带补充注释（与单词总表一致） */
function wordSectionsHTML(it, compact){
  let h = '';
  if (it.sen1) h += `<div class="detail-quote"><span class="q-tag">常用例句</span>
    <p class="en">${esc(it.sen1[0])}</p><p class="cn">${esc(it.sen1[1])}</p></div>`;
  if (it.sen2) h += `<div class="detail-quote"><span class="q-tag gold">出彩例句</span>
    <p class="en">${esc(it.sen2[0])}</p><p class="cn">${esc(it.sen2[1])}</p></div>`;
  if (it.alt && it.alt.length)
    h += `<div class="wp-sec"><h5>可替换词${compact ? '' : '<small>写作升级 · 同义更出彩的表达</small>'}</h5>
      <div class="alt-chips">${it.alt.map(a => `<i>${esc(a)}</i>`).join('')}</div></div>`;
  if (it.pos2)
    h += `<div class="wp-sec"><h5>词性转换</h5>
      <div class="phr-lines">${splitListSafe(it.pos2).map(x => `<p>${esc(x)}</p>`).join('')}</div></div>`;
  if (it.phr && it.phr.length)
    h += `<div class="wp-sec"><h5>常见短语</h5>
      <div class="phr-lines">${it.phr.map(x => `<p>${esc(x)}</p>`).join('')}</div></div>`;
  return h;
}
const splitListSafe = s => String(s || '').split(/[;；]/).map(x => x.trim()).filter(Boolean);

function wordPageHTML(it){
  return `<article class="card word-hero" id="wordHero">
      <span class="badge">${esc(wordLevel(it))}</span>
      <h3 class="detail-word">${esc(it.word)}</h3>
      <p class="detail-meaning">${esc(it.meaning)}</p>
    </article>
    <div class="detail-btns wp-btns">
      <button class="btn ghost" onclick="App.wpFav('${it.id}',this)">${isFav('words', it.id) ? '★ 已收藏' : '☆ 收藏'}</button>
      <button class="btn" onclick="App.joinReview('words','${it.id}')">加入复习</button>
    </div>
    ${wordSectionsHTML(it) || '<div class="empty" style="padding:30px">该词暂无扩展板块<br>例句 / 替换词等内容将陆续补充</div>'}`;
}
function openWordPage(id, el){
  const it = bankItem('words', id);
  if (!it){ toast('素材不存在'); return; }
  if (currentView !== 'word') wordBack = currentView; // 记住返回位置
  $('#wordBody').innerHTML = wordPageHTML(it);
  const go = () => showView('word');
  if (el){ el.style.viewTransitionName = 'hero-card'; heroSwap(go, el, $('#wordHero')); }
  else heroSwap(go);
}
function backFromWord(){
  if (['home', 'plaza', 'drafts', 'mine'].includes(wordBack)) switchTab(wordBack);
  else showView(wordBack);
}
/* 广场紧凑卡：点击右侧显示 / 隐藏释义 */
const toggleMeaning = el => el.classList.toggle('show');
/* 广场紧凑卡：点击左侧单词 → 卡片内展开 / 收起扩展板块
   内容懒生成（首次展开才渲染），openWordIds 记住展开状态，列表刷新后仍保持展开 */
const openWordIds = new Set();
function toggleWordExpand(id, el){
  const det = el.closest('.w-card').querySelector('.w-detail');
  if (det.classList.contains('open')){
    det.classList.remove('open');
    openWordIds.delete(id);
    return;
  }
  if (!det.dataset.ready){
    const it = bankItem('words', id);
    if (!it){ toast('素材不存在'); return; }
    const html = wordSectionsHTML(it, true);
    if (!html){ toast('该词暂无例句与扩展内容'); return; }
    det.querySelector('.w-detail-in').innerHTML = html;
    det.dataset.ready = '1';
  }
  det.classList.add('open');
  openWordIds.add(id);
}
/* 详情页收藏按钮 */
function wpFav(id, btn){
  const added = toggleFavCore('words', id);
  btn.textContent = added ? '★ 已收藏' : '☆ 收藏';
  toast(added ? '已存入草稿箱' : '已取消收藏');
}

/* ================= 应用文模板库（浏览页） =================
   左侧体裁栏（可伸缩）+ 右侧内容区；万能句式作为第一个「体裁」 */
let tplGenre = null, tplFolded = false;

function openTemplates(){
  if (!tplGenre) tplGenre = (window.TPL_GENRES && TPL_GENRES[0]) ? TPL_GENRES[0].id : 'common';
  heroSwap(() => showView('templates'));
}
function tplNavList(){
  const list = [{ id:'common', name:'万能句式', en:'Common · 全体裁' }];
  (window.TPL_GENRES || []).forEach(g => list.push({ id:g.id, name:g.name, en:g.en }));
  return list;
}
function renderTplSide(){
  $('#tplSide').innerHTML = tplNavList().map(g => `
    <button class="tpl-nav ${tplGenre === g.id ? 'on' : ''}" onclick="App.pickTplGenre('${g.id}')">
      ${esc(g.name)}<small>${esc(g.en)}</small>
    </button>`).join('');
}
function renderTplView(){
  if (!tplGenre) tplGenre = (window.TPL_GENRES && TPL_GENRES[0]) ? TPL_GENRES[0].id : 'common';
  renderTplSide();
  $('#tplMain').innerHTML = tplContentHTML();
  $('#tplWrap').classList.toggle('folded', tplFolded);
  $('#tplHandle').textContent = tplFolded ? '›' : '‹';
  $('#tplPill').textContent = tplFolded ? '展开体裁栏' : '收起体裁栏';
}
function pickTplGenre(id){
  tplGenre = id;
  renderTplSide();
  $('#tplMain').innerHTML = tplContentHTML();
  $('#tplMain').scrollTop = 0;
}
function toggleTplSide(){
  tplFolded = !tplFolded;
  $('#tplWrap').classList.toggle('folded', tplFolded);
  $('#tplHandle').textContent = tplFolded ? '›' : '‹';
  $('#tplPill').textContent = tplFolded ? '展开体裁栏' : '收起体裁栏';
}
/* 内容区：体裁头 + 开头/中间/结尾分组 + 写作提示 */
function tplContentHTML(){
  let h = '';
  const senRow = (id, s) => {
    const faved = isFav('writing', id);
    return `<div class="tpl-sen" onclick="App.tplStar('${id}',this)">
      <span class="tpl-star ${faved ? 'on' : ''}">${faved ? '★' : '☆'}</span>
      <div class="tpl-sen-body"><p class="en">${esc(s[0])}</p><p class="cn">${esc(s[1])}</p></div>
    </div>`;
  };
  const sec = (title, rows) => rows.length
    ? `<div class="tpl-sec"><h5>${esc(title)}</h5>${rows.join('')}</div>` : '';

  if (tplGenre === 'common'){
    h += `<div class="tpl-genre-head"><h3>万能句式<small>Common · 全体裁通用</small></h3>
      <p class="tpl-scene">跨体裁通用的写作目的、寒暄、分层、请求、收尾与衔接表达，背熟可直接套进任何一篇应用文。</p></div>`;
    (window.TPL_COMMON || []).forEach((grp, gi) => {
      h += sec(grp[0], grp[1].map((s, i) => senRow('common_' + gi + '_' + i, s)));
    });
    return h;
  }
  const g = (window.TPL_GENRES || []).find(x => x.id === tplGenre);
  if (!g) return '<div class="empty">未找到该体裁</div>';
  h += `<div class="tpl-genre-head"><h3>${esc(g.name)}<small>${esc(g.en)}</small></h3>
    <p class="tpl-scene">${esc(g.scene)}</p></div>`;
  h += sec('开头怎么写', (g.open || []).map((s, i) => senRow(g.id + '_o' + i, s)));
  (g.mid || []).forEach((grp, gi) => {
    h += sec(grp[0], (grp[1] || []).map((s, i) => senRow(g.id + '_m' + gi + '_' + i, s)));
  });
  h += sec('常用结尾', (g.close || []).map((s, i) => senRow(g.id + '_c' + i, s)));
  if (g.tips && g.tips.length)
    h += `<div class="tpl-tips"><b>写作要诀</b>${g.tips.map(t => `<p>${esc(t)}</p>`).join('')}</div>`;
  return h;
}
/* 模板句收藏（草稿箱共用一套收藏夹） */
function tplStar(id, el){
  const added = toggleFavCore('writing', id);
  const star = el.querySelector('.tpl-star');
  if (star){ star.classList.toggle('on', added); star.textContent = added ? '★' : '☆'; }
  toast(added ? '已存入草稿箱' : '已取消收藏');
}

/* ================= 读后续写素材库（分类浏览页） =================
   左侧一级分类栏（可伸缩，复用 tpl-* 样式）+ 顶部二级滑动栏 + 句卡列表
   分类数据：js/describe.js 的 XXW_CATS / XXW_DRAFT（data.js 组装进 XUEXIE_BANK） */
const xxNavList = () => window.XXW_CATS || [];
let xxCat = null, xxSub = null, xxFolded = false;

function openXuexie(){
  if (!xxCat){
    const first = xxNavList()[0];
    xxCat = first.id; xxSub = first.subs[0].id;
  }
  heroSwap(() => showView('xuexie'));
}
const xxSenCount = sid => XUEXIE_BANK.filter(it => it.sid === sid).length;
const xxCatCount = cat => XUEXIE_BANK.filter(it => cat.subs.some(s => s.id === it.sid)).length;

function renderXxView(){
  renderXxSide();
  renderXxMain();
  $('#xxWrap').classList.toggle('folded', xxFolded);
  $('#xxHandle').textContent = xxFolded ? '›' : '‹';
  $('#xxPill').textContent = xxFolded ? '展开分类栏' : '收起分类栏';
}
function renderXxSide(){
  $('#xxSide').innerHTML = xxNavList().map(c => `
    <button class="tpl-nav ${xxCat === c.id ? 'on' : ''}" onclick="App.pickXxCat('${c.id}')">
      ${esc(c.name)}<small>${c.subs.length} 个子类 · ${xxCatCount(c)} 句</small>
    </button>`).join('');
}
function renderXxMain(){
  const cat = xxNavList().find(c => c.id === xxCat) || xxNavList()[0];
  if (!cat.subs.some(s => s.id === xxSub)) xxSub = cat.subs[0].id;
  $('#xxMain').innerHTML = `
    <div class="xx-chips">${cat.subs.map(s => `
      <button class="xx-chip ${s.id === xxSub ? 'on' : ''}" onclick="App.pickXxSub('${s.id}')">
        ${esc(s.name)}<i>${xxSenCount(s.id)}</i>
      </button>`).join('')}</div>
    <div id="xxBody">${xxListHTML()}</div>`;
}
function xxListHTML(){
  const list = XUEXIE_BANK.filter(it => it.sid === xxSub);
  if (!list.length) return '<div class="empty">该子类语料拟写中，敬请期待</div>';
  return list.map(it => {
    const faved = isFav('xuexie', it.id);
    return `<div class="xx-sen" onclick="App.heroOpenDetail('xuexie','${it.id}',this)">
      <button class="icon-btn star-btn ${faved ? 'on' : ''}" aria-label="收藏"
        onclick="event.stopPropagation();App.toggleFav('xuexie','${it.id}',this)">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="${faved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8Z"/></svg>
      </button>
      <span class="xx-struct">${esc(it.scenes[1] || '')}</span>
      <p class="xx-en">${esc(it.en)}</p>
      ${it.tpl ? `<p class="xx-tpl"><b>模板</b>${esc(it.tpl)}</p>` : ''}
      <p class="xx-cn">${esc(it.cn)}</p>
    </div>`;
  }).join('');
}
function pickXxCat(id){
  const cat = xxNavList().find(c => c.id === id);
  if (!cat) return;
  xxCat = id; xxSub = cat.subs[0].id;
  renderXxSide(); renderXxMain();
  $('#xxMain').scrollTop = 0;
}
function pickXxSub(id){
  xxSub = id;
  renderXxMain();
  $('#xxMain').scrollTop = 0;
}
function toggleXxSide(){
  xxFolded = !xxFolded;
  $('#xxWrap').classList.toggle('folded', xxFolded);
  $('#xxHandle').textContent = xxFolded ? '›' : '‹';
  $('#xxPill').textContent = xxFolded ? '展开分类栏' : '收起分类栏';
}

/* ================= 素材详情弹窗（读后续写 / 模板句） ================= */
function detailCardHTML(cat, it){
  let inner = '';
  if (cat === 'writing'){
    inner = `<span class="badge orange">${esc(it.genre)}</span><span class="badge soft">${esc(it.partName)}</span>
      <p class="detail-en" style="margin-top:16px">${esc(it.en)}</p>
      <p class="detail-cn">${esc(it.cn)}</p>`;
  } else {
    inner = `<span class="badge">读后续写</span>
      <p class="detail-en" style="margin-top:16px">${esc(it.en)}</p>
      <p class="detail-cn">${esc(it.cn)}</p>`;
  }
  const scenes = (it.scenes || []).map(s => `<i>${esc(s)}</i>`).join('');
  const tplLine = it.tpl ? `<p class="detail-tpl"><b>结构模板</b><i>${esc(it.tpl)}</i></p>` : '';
  const faved = isFav(cat, it.id);
  return `<article class="detail-card">
    <button class="icon-btn detail-close" aria-label="关闭" onclick="App.closeDetail()">✕</button>
    ${inner}
    ${tplLine}
    ${scenes ? `<p class="detail-scenes">适用场景：${scenes}</p>` : ''}
    <div class="detail-btns">
      <button class="btn ghost" id="detailFav">${faved ? '★ 已收藏' : '☆ 收藏'}</button>
      <button class="btn" id="detailJoin">加入复习</button>
    </div>
  </article>`;
}
function openDetail(cat, id){
  const it = bankItem(cat, id);
  if (!it){ toast('素材不存在'); return; }
  $('#detailWrap').innerHTML = detailCardHTML(cat, it);
  $('#modalDetail').classList.add('open');
  $('#detailJoin').onclick = () => joinReview(cat, id);
  $('#detailFav').onclick  = () => {
    toggleFavCore(cat, id);
    const faved = isFav(cat, id);
    $('#detailFav').textContent = faved ? '★ 已收藏' : '☆ 收藏';
    toast(faved ? '已存入草稿箱' : '已取消收藏');
  };
}
const closeDetail = () => $('#modalDetail').classList.remove('open');

/* ================= 草稿箱（素材收藏仓库） =================
   与复习队列完全独立：收藏不生成复习任务，复习队列不读收藏。
   wbx_favs: [{ key:'cat:id', cat, id, item:{完整素材快照}, savedAt }] */
const getFavs = () => store.get('wbx_favs', []);
const setFavs = f => store.set('wbx_favs', f);
const isFav = (cat, id) => getFavs().some(f => f.key === cat + ':' + id);

function toggleFavCore(cat, id){
  const favs = getFavs(), k = cat + ':' + id;
  const idx = favs.findIndex(f => f.key === k);
  if (idx >= 0){ favs.splice(idx, 1); setFavs(favs); return false; }
  const it = bankItem(cat, id);
  if (!it){ toast('素材不存在'); return false; }
  favs.push({ key:k, cat, id, item: Object.assign({}, it), savedAt: Date.now() }); // 快照保留完整信息
  setFavs(favs);
  return true;
}
/* 通用收藏切换：更新点击的星星按钮状态并同步刷新相关列表 */
function toggleFav(cat, id, el){
  const added = toggleFavCore(cat, id);
  if (el){
    el.classList.toggle('on', added);
    const path = el.querySelector('svg path');
    if (path) path.setAttribute('fill', added ? 'currentColor' : 'none');
  }
  if (currentView === 'plaza')  renderPlazaList(); // 保持当前分页位置，不重置
  if (currentView === 'drafts') renderFavs();
  updateExampleStar();
  toast(added ? '已存入草稿箱' : '已取消收藏');
}
function favExample(){
  if (!exampleItem) return;
  const added = toggleFavCore('xuexie', exampleItem.id);
  updateExampleStar();
  toast(added ? '已存入草稿箱' : '已取消收藏');
}
function updateExampleStar(){
  const btn = $('#exampleFavBtn');
  if (!btn) return;
  const on = exampleItem && isFav('xuexie', exampleItem.id);
  btn.classList.toggle('on', !!on);
  btn.querySelector('svg path').setAttribute('fill', on ? 'currentColor' : 'none');
}

/* 草稿箱分类筛选：全部 / 单词 / 读后续写 / 应用文（带计数） */
let favCat = 'all';
function setFavCat(c){ favCat = c; renderFavs(); }
function renderFavs(){
  const favs = getFavs().slice().sort((a, b) => b.savedAt - a.savedAt);
  const cats = [
    { k:'all',     name:'全部' },
    { k:'words',   name:'单词' },
    { k:'xuexie',  name:'读后续写' },
    { k:'writing', name:'应用文' }
  ];
  $('#favTabs').innerHTML = cats.map(c => {
    const n = c.k === 'all' ? favs.length : favs.filter(f => f.cat === c.k).length;
    return `<button class="fav-tab ${favCat === c.k ? 'on' : ''}" onclick="App.setFavCat('${c.k}')">${c.name} <b>${n}</b></button>`;
  }).join('');

  const list = favCat === 'all' ? favs : favs.filter(f => f.cat === favCat);
  $('#favList').innerHTML = list.length ? list.map(favCardHTML).join('')
    : `<div class="empty">暂无收藏<br>在素材广场、模板库、例句卡片或学习页点击 ☆ 即可收藏</div>`;
}
function favCardHTML(f){
  const it = f.item;
  let badge = '', keyword = '', main = '', sub = '', scenes = '', copyText = '';
  if (f.cat === 'words'){
    badge  = `<span class="badge">${esc(wordLevel(it))}</span>`;
    keyword = esc(it.word);
    main   = it.sen1 ? `<p class="f-en">${esc(it.sen1[0])}</p>` : '';
    sub    = it.sen1 ? `<p class="f-cn">${esc(it.sen1[1])}</p>`
                      : `<p class="f-cn">${esc(it.meaning)}</p>`;
    scenes = `${esc(it.pos || '')} ${esc(it.meaning)}${(it.alt && it.alt.length) ? ' · 替换：' + esc(it.alt.slice(0, 3).join(' / ')) : ''}`;
    copyText = it.word + '\n' + it.meaning + (it.sen1 ? '\n' + it.sen1[0] + '\n' + it.sen1[1] : '');
  } else if (f.cat === 'writing'){
    badge  = `<span class="badge orange">${esc(it.genre)}</span>`;
    keyword = esc(it.partName);
    main   = `<p class="f-en">${esc(it.en)}</p>`;
    sub    = `<p class="f-cn">${esc(it.cn)}</p>`;
    scenes = '';
    copyText = it.en + '\n' + it.cn;
  } else {
    badge  = `<span class="badge orange">读后续写</span>`;
    main   = `<p class="f-en">${esc(it.en)}</p>`;
    sub    = `<p class="f-cn">${esc(it.cn)}</p>`;
    scenes = `适用场景：${(it.scenes || []).map(esc).join(' · ') || '—'}`;
    copyText = it.en + '\n' + it.cn;
  }
  return `<article class="card f-card">
    <div class="f-top">${badge}${keyword ? `<span class="f-key">${keyword}</span>` : ''}
      <button class="f-del" onclick="App.toggleFav('${f.cat}','${f.id}')">删除</button></div>
    ${main}
    ${sub}
    ${scenes ? `<p class="f-scenes">${scenes}</p>` : ''}
    <div class="f-links"><button class="f-link" onclick="App.copyFav(this)" data-copy="${esc(copyText)}">复制</button></div>
  </article>`;
}
function copyFav(btn){
  const text = btn.dataset.copy || '';
  const done = () => toast('已复制到剪贴板');
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done, () => toast('复制失败，请手动选择文本'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); done(); }catch(e){ toast('复制失败，请手动选择文本'); }
    ta.remove();
  }
}

/* ================= 复习队列页（独立页面） ================= */
function renderReview(){
  const wrap = $('#reviewList');
  const today = todayStr();
  const html = LIB_KEYS.map(k => {
    const st = libState(k);
    const dueIds = Object.entries(st.items)
      .filter(([, v]) => v.qState === 'pending' && v.dueDate <= today)
      .map(([id]) => id);
    const rows = dueIds.map(id => {
      const it = bankItem(k, id);
      if (!it) return '';
      const brief = k === 'words' ? `${it.word}　${it.meaning}`
                  : k === 'writing' ? `${it.genre} · ${it.en}`
                  : it.en;
      const act  = k === 'words'
        ? `App.openWordPage('${it.id}',this)`
        : `App.heroOpenDetail('${k}','${it.id}',this)`;
      return `<button class="rv-row" onclick="${act}">
        <span class="rv-txt">${esc(brief)}</span><span class="rv-go">›</span></button>`;
    }).join('');
    return `<div class="card rv-card">
      <div class="rv-head">
        <div class="rv-title">${LIBS[k].name}<small>${dueIds.length ? dueIds.length + ' 条待复习' : '暂无待复习'}</small></div>
        ${dueIds.length
          ? `<button class="btn small" onclick="App.startReviewFor('${k}')">开始复习</button>`
          : `<span class="rv-done">已完成</span>`}
      </div>
      ${rows}
    </div>`;
  }).join('');
  const any = LIB_KEYS.some(k => pendingReviewCount(libState(k)) > 0);
  wrap.innerHTML = html + (any ? '' :
    `<div class="empty">复习队列是空的<br>今天学完的新词 / 新句子，明天会自动出现在这里</div>`);
}
/* 从复习队列页指定板块开始复习（不改变默认板块设置） */
const startReviewFor = k => enterStudy('review', null, k);

/* ================= 作文草稿（原功能，独立子页面） ================= */
const getDrafts  = () => store.get('wbx_drafts', []);
const setDrafts  = d => store.set('wbx_drafts', d);
let editingId = null, saveTimer = null;

function renderDrafts(){
  const list = getDrafts().slice().sort((a, b) => b.savedAt - a.savedAt);
  $('#essayList').innerHTML = list.length ? list.map(d => `
    <article class="card d-card" onclick="App.openDraft('${d.id}', this)">
      <h4>${esc(d.title || '无标题草稿')}</h4>
      <p>${esc((d.content || '').trim().slice(0, 60) || '暂无内容')}</p>
      <span class="d-time">保存于 ${fmtTime(d.savedAt)}</span>
    </article>`).join('')
    : `<div class="empty">暂无草稿<br>点击右上角「＋ 新建」开始你的第一篇作文</div>`;
}
const openEssays = () => heroSwap(() => showView('essays'));
function newDraft(){
  const d = { id:'d' + Date.now(), title:'', content:'', savedAt:Date.now() };
  setDrafts([d, ...getDrafts()]);
  heroSwap(() => openDraftEditor(d.id));
}
function openDraft(id, el){
  el.style.viewTransitionName = 'hero-card';
  heroSwap(() => openDraftEditor(id), el);
}
function openDraftEditor(id){
  const d = getDrafts().find(x => x.id === id);
  if (!d) return;
  editingId = id;
  $('#draftTitle').value = d.title;
  $('#draftBody').value  = d.content;
  $('#saveState').textContent = '自动保存已开启';
  showView('editor');
}
/* 输入防抖自动保存 */
function autoSave(){
  if (!editingId) return;
  $('#saveState').textContent = '正在保存…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushDraft, 500);
}
function flushDraft(){
  if (!editingId) return;
  const ds = getDrafts(), d = ds.find(x => x.id === editingId);
  if (!d) return;
  d.title = $('#draftTitle').value;
  d.content = $('#draftBody').value;
  d.savedAt = Date.now();
  setDrafts(ds);
  $('#saveState').textContent = '已保存 ' + fmtTime(d.savedAt);
}
function closeEditor(){
  clearTimeout(saveTimer);
  flushDraft();
  editingId = null;
  showView('essays');
}
function deleteDraft(){
  if (!editingId) return;
  confirmBox('确定删除这篇草稿吗？删除后不可恢复。', () => {
    setDrafts(getDrafts().filter(x => x.id !== editingId));
    editingId = null;
    showView('essays');
    toast('草稿已删除');
  });
}

/* ================= 我的（学习数据合并展示） =================
   三库数据合为一个卡片，点击展开各板块明细 */
let statsOpen = false;
function toggleStats(){ statsOpen = !statsOpen; renderMine(); }
function renderMine(){
  const states = LIB_KEYS.map(k => ({ k, st: libState(k) }));
  const sumNew  = states.reduce((n, x) => n + x.st.totalNew, 0);
  const sumRev  = states.reduce((n, x) => n + x.st.totalReview, 0);
  const sumTodo = states.reduce((n, x) => n + pendingReviewCount(x.st), 0);
  const detail = states.map(({ k, st }) => `
    <div class="sd-lib">
      <div class="sd-name">${LIBS[k].name}<small>${LIBS[k].desc}</small></div>
      <div class="sd-grid">
        <div><b>${st.totalNew}</b><span>累计学习</span></div>
        <div><b>${st.totalReview}</b><span>累计复习</span></div>
        <div><b>${st.newDone}/${st.daily}</b><span>今日新学</span></div>
        <div><b>${st.reviewDone}</b><span>今日复习</span></div>
      </div>
    </div>`).join('');
  $('#statsWrap').innerHTML = `
    <div class="card stat-merged ${statsOpen ? 'open' : ''}" onclick="App.toggleStats()">
      <div class="stat-top">
        <div class="stat-cap"><h4>学习数据<small>三个板块汇总</small></h4></div>
        <span class="stat-sum">累计学 ${sumNew} · 复 ${sumRev} · 待复习 ${sumTodo}</span>
        <i class="stat-arrow ${statsOpen ? 'up' : ''}"></i>
      </div>
      <div class="stats-detail"><div class="stats-inner">${detail}</div></div>
    </div>`;
}
function clearRecords(){
  confirmBox('确定清空全部本地学习记录吗？三个板块的学习与复习进度将重置（草稿与收藏不受影响）。', () => {
    store.set('wbx_libs', {});
    renderMine();
    toast('学习记录已清空');
  });
}
const openAbout = () => $('#modalAbout').classList.add('open');

/* ================= 通用确认弹窗 ================= */
let confirmCb = null;
function confirmBox(msg, cb){
  $('#confirmMsg').textContent = msg;
  confirmCb = cb;
  $('#modalConfirm').classList.add('open');
}
function confirmOk(){
  closeModal('modalConfirm');
  const cb = confirmCb; confirmCb = null;
  if (cb) cb();
}

/* ---------------- 初始化 ---------------- */
function init(){
  shuffleExample();   // 首页随机例句（每次页面加载抽取）
  renderHome();
  renderPlaza();
  renderDrafts();
  renderMine();
}
init();

/* ---------------- 对外暴露 ---------------- */
return {
  switchTab, goHome, showView,
  shuffleExample, openExampleDetail, favExample,
  startStudy, startReview, goReview, mark, toggleFlash,
  openReview, startReviewFor,
  openPicker, pickLib, setSrc, stepDaily, setDaily, confirmPicker, closeModal,
  setPlazaCat, renderPlaza, morePlaza, heroOpenDetail, joinReview,
  openWordPage, backFromWord, toggleMeaning, toggleWordExpand, wpFav,
  openTemplates, pickTplGenre, toggleTplSide, tplStar,
  openXuexie, pickXxCat, pickXxSub, toggleXxSide,
  openDetail, closeDetail,
  toggleFav, setFavCat, copyFav,
  openEssays, newDraft, openDraft, autoSave, closeEditor, deleteDraft,
  toggleStats, clearRecords, openAbout, confirmOk
};
})();
