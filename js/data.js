/* =====================================================
   写作航标 · 语料组装层（数据与逻辑分离）
   -----------------------------------------------------
   上游数据（独立文件，替换 / 扩充无需改页面逻辑）：
     vocab-base.js    VOCAB_BASE    高考+四级全量词 {w, m, s}
     vocab-core.js    VOCAB_CORE    核心写作词（可替换词/双例句/词性转换/短语）
     vocab-writing.js VOCAB_EXTRA   应用文高频词（带例句）
     templates.js     TPL_COMMON / TPL_GENRES   应用文模板句
   本文件只做「组装」，输出三个语料库数组（app.js 仅读这三个）：
     WORDS_BANK    背单词（A-Z 排序）
     WRITING_BANK  应用文模板句（按体裁分组：开头→中间→结尾）
     XUEXIE_BANK   读后续写素材
   ===================================================== */

/* ---------- ① 背单词 ----------
   合并优先级：VOCAB_BASE(基础) < VOCAB_EXTRA(应用文例句) < VOCAB_CORE(完整板块)
   最终字段：
     id       唯一标识
     word     单词
     meaning  中文释义（含词性前缀，如 "n. 活动"）
     pos      词性（从释义前缀解析）
     alt      可替换词数组（核心词）
     sen1     常用例句 [en, cn]（核心/应用文词）
     sen2     出彩例句 [en, cn]（核心词，读后续写向）
     pos2     词性转换文本（核心词）
     phr      常见短语数组（核心词）
     level    core 核心写作词 | writing 应用文高频词 | base 基础词
     src      base 词来源：gk 高考 | c4 四级
---------------------------------------------------- */
const POS_RE = /^(n\.|v\.|vi\.|vt\.|adj\.|adv\.|prep\.|conj\.|pron\.|num\.|art\.|int\.|interj\.|abbr\.)/;
const splitList = s => String(s || '').split(/[;；]/).map(x => x.trim()).filter(Boolean);

const _wmap = new Map();
function addWord(src, level){
  const w = String(src.w).trim();
  const key = w.toLowerCase();
  let it = _wmap.get(key);
  if (!it){
    it = {
      id: 'w_' + key.replace(/[^a-z]+/g, '_'),
      word: w,
      meaning: src.m || '',
      pos: (String(src.m || '').match(POS_RE) || [''])[0],
      alt: [], sen1: null, sen2: null, pos2: '', phr: [],
      level: level, src: src.s || ''
    };
    _wmap.set(key, it);
  }
  if (level === 'writing'){
    if (!it.sen1 && src.sen1){ it.sen1 = src.sen1; if (it.level === 'base') it.level = 'writing'; }
  } else if (level === 'core'){
    it.meaning = src.m || it.meaning;
    it.pos     = (String(src.m || '').match(POS_RE) || [''])[0] || it.pos;
    it.alt     = splitList(src.alt);
    it.sen1    = src.sen1 || it.sen1;
    it.sen2    = src.sen2 || null;
    it.pos2    = src.pos || '';
    it.phr     = splitList(src.phr);
    it.level   = 'core';
  }
}
(window.VOCAB_BASE  || []).forEach(x => addWord(x, 'base'));
(window.VOCAB_EXTRA || []).forEach(x => addWord(x, 'writing'));
(window.VOCAB_CORE  || []).forEach(x => addWord(x, 'core'));

/* A-Z 排序（要求：所有单词按 a-z 顺序排列），并预生成搜索索引 */
const WORDS_BANK = [..._wmap.values()]
  .sort((a, b) => a.word.localeCompare(b.word, 'en', { sensitivity: 'base' }));
WORDS_BANK.forEach(it => { it._search = (it.word + ' ' + it.meaning).toLowerCase(); });

/* ---------- ② 应用文模板句 ----------
   把 TPL_GENRES（19 体裁）与 TPL_COMMON（万能句式）摊平成「一句一卡片」：
     id        唯一标识（体裁id_o序号 / _m组_序号 / _c序号 / common_组_序号）
     genreId   所属体裁 id（common 为万能句式）
     genre     体裁中文名
     partName  板块名（开头 / 结尾 / 中间功能组名）
     en / cn   英文句 + 中文提示
   数组顺序 = 学习顺序：同体裁内 开头→中间→结尾 连续出现。
   重复英文句自动去重（保留首次出现）。
---------------------------------------------------- */
const _wtmp = [];
(window.TPL_GENRES || []).forEach(g => {
  (g.open || []).forEach((s, i) => _wtmp.push({
    id: g.id + '_o' + i, genreId: g.id, genre: g.name, part: 'open', partName: '开头',
    en: s[0], cn: s[1] }));
  (g.mid || []).forEach((grp, gi) => (grp[1] || []).forEach((s, i) => _wtmp.push({
    id: g.id + '_m' + gi + '_' + i, genreId: g.id, genre: g.name, part: 'mid', partName: grp[0],
    en: s[0], cn: s[1] })));
  (g.close || []).forEach((s, i) => _wtmp.push({
    id: g.id + '_c' + i, genreId: g.id, genre: g.name, part: 'close', partName: '结尾',
    en: s[0], cn: s[1] }));
});
(window.TPL_COMMON || []).forEach((grp, gi) => (grp[1] || []).forEach((s, i) => _wtmp.push({
  id: 'common_' + gi + '_' + i, genreId: 'common', genre: '万能句式', part: 'common', partName: grp[0],
  en: s[0], cn: s[1] })));

const _seenEn = new Set();
const WRITING_BANK = _wtmp.filter(x => {
  const k = x.en.toLowerCase().replace(/\s+/g, ' ');
  if (_seenEn.has(k)) return false;
  _seenEn.add(k);
  x._search = k + x.cn;
  return true;
});

/* ---------- ③ 读后续写素材：结构拟写句 ----------
   数据源 js/describe.js：XXW_CATS（一级/二级分类体系）+ XXW_DRAFT（拟写句）
   最终字段：
     id       唯一标识
     en / cn  英文短句 + 中文翻译
     sid      所属二级分类 id（素材库分类浏览用）
     cat/sub  一级、二级分类名（展示用）
     scenes   适用场景标签 = [一级 · 二级, 结构名]（学习卡/详情卡展示）
     tpl      结构模板（填空公式，详情卡金底行展示）
   ★ 首页例句卡片即从本数组随机抽取展示。
------------------------------------------------------------ */
const _xxmap = new Map();
(window.XXW_CATS || []).forEach(c => c.subs.forEach(s => _xxmap.set(s.id, { cat: c.name, sub: s.name })));
const XUEXIE_BANK = (window.XXW_DRAFT || []).map(d => {
  const m = _xxmap.get(d.sub) || { cat: '', sub: '' };
  return {
    id: d.id,
    en: d.en, cn: d.cn,
    sid: d.sub,
    cat: m.cat, sub: m.sub,
    scenes: [m.cat && (m.cat + ' · ' + m.sub), d.struct].filter(Boolean),
    tpl: d.tpl || ''
  };
});
