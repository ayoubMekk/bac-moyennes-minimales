"use strict";

/* ---- i18n ---- */
const I18N = {
  fr: {
    title: "Moyennes minimales BAC",
    hero_title: "Trouvez la moyenne minimale de votre filière",
    hero_sub: "BAC 2023 · 2024 · 2025 — recherchez une spécialité.",
    search_ph: "Ex : informatique, droit, médecine…",
    your_stream: "Votre filière au BAC :",
    stream_any: "— Toutes —",
    your_wilaya: "Votre wilaya du BAC :",
    wilaya_any: "— Toutes —",
    pour_bacheliers: "Bacheliers de",
    open_all: "Toutes wilayas",
    footer: "Données : moyennes minimales d'affectation (MESRS). Application non officielle.",
    sources: "Fichiers sources :",
    circulaire: "Circulaire",
    contact: "Une erreur ou une suggestion ? Contactez-moi :",
    tab_search: "Rechercher",
    tab_orient: "M'orienter",
    orient_title: "Estimez vos chances",
    orient_sub: "Renseignez votre BAC pour voir les spécialités accessibles.",
    warn_title: "Estimation approximative.",
    warn_body: "Les moyennes minimales ne sont pas des seuils : elles résultent de la demande et des places disponibles de chaque année, et changent donc chaque année. Ce sont des repères des années passées, pas une garantie.",
    o_stream: "Votre filière au BAC",
    o_wilaya: "Votre wilaya du BAC",
    o_mg: "Moyenne générale du BAC",
    o_hint: "Les notes servent à calculer la moyenne pondérée, utilisée par certains domaines.",
    o_go: "Voir les spécialités",
    o_pick: "— Choisir —",
    o_empty: "Renseignez votre filière, votre wilaya et votre moyenne.",
    o_none: "Aucune spécialité ne correspond à votre filière du BAC.",
    o_missing: "Complétez les notes manquantes pour ces domaines.",
    o_results: "spécialité(s) trouvée(s)",
    o_recap: "Votre profil",
    o_yourmoy: "Votre moyenne pour cette spécialité",
    o_needed: "Minimale la plus basse (2025)",
    o_margin: "Écart",
    o_band_ok: "Probable",
    o_band_edge: "Limite",
    o_band_no: "Peu probable",
    o_band_ok_h: "Votre moyenne dépasse nettement la minimale de 2025.",
    o_band_edge_h: "Votre moyenne est très proche de la minimale de 2025 : cela peut basculer d'une année à l'autre.",
    o_band_no_h: "Votre moyenne est en dessous de la minimale de 2025.",
    o_places: "établissement(s) accessible(s)",
    o_see: "Voir le détail",
    o_calc_used: "Calcul utilisé",
    o_again: "Modifier mes informations",
    o_reminder: "Rappel : estimation indicative basée sur les années passées, pas une garantie d'affectation.",
    empty: "Commencez à taper le nom d'une spécialité (en français ou en arabe) ou d'un domaine.",
    loading: "Chargement des données…",
    noresults: "Aucune spécialité trouvée.",
    error: "Impossible de charger les données.",
    back: "← Retour aux résultats",
    establishments: "établissement(s)",
    filter_wil: "Toutes les wilayas",
    filter_etb: "Filtrer par établissement…",
    national: "National",
    prio_generic: "Min 1 / 2 / 3 selon la filière (non détaillé)",
    prio_row_generic: "Priorité selon la filière",
    prio_title: "Que signifient Min 1 · 2 · 3 ?",
    calc_base: "Base de classement",
    na: "n.d.",
  },
  ar: {
    title: "المعدلات الدنيا للبكالوريا",
    hero_title: "ابحث عن المعدل الأدنى للالتحاق بشعبتك",
    hero_sub: "بكالوريا 2023 · 2024 · 2025 — ابحث عن تخصص.",
    search_ph: "اكتب اسم التخصص (بالعربية أو الفرنسية) أو الميدان…",
    your_stream: "شعبتك في البكالوريا:",
    stream_any: "— الكل —",
    your_wilaya: "ولاية البكالوريا:",
    wilaya_any: "— الكل —",
    pour_bacheliers: "لناجحي ولاية",
    open_all: "كل الولايات",
    footer: "البيانات: المعدلات الدنيا للتوجيه (وزارة التعليم العالي). تطبيق غير رسمي.",
    sources: "الملفات المصدر:",
    circulaire: "المنشور",
    contact: "خطأ أو اقتراح؟ تواصل معي:",
    tab_search: "بحث",
    tab_orient: "توجيهي",
    orient_title: "قدّر فرصك",
    orient_sub: "أدخل معطيات بكالوريتك لعرض التخصصات الممكنة.",
    warn_title: "تقدير تقريبي.",
    warn_body: "المعدلات الدنيا ليست عتبات محددة مسبقًا: فهي نتيجة الطلب والمقاعد المتاحة في كل سنة، وتتغير من سنة إلى أخرى. هي مؤشرات من السنوات الماضية وليست ضمانًا.",
    o_stream: "شعبتك في البكالوريا",
    o_wilaya: "ولاية البكالوريا",
    o_mg: "المعدل العام للبكالوريا",
    o_hint: "تُستعمل العلامات لحساب المعدل الموزون المعتمد في بعض الميادين.",
    o_go: "اعرض التخصصات",
    o_pick: "— اختر —",
    o_empty: "أدخل شعبتك وولايتك ومعدلك.",
    o_none: "لا يوجد تخصص يقبل شعبتك في البكالوريا.",
    o_missing: "أكمل العلامات الناقصة لهذه الميادين.",
    o_results: "تخصص",
    o_recap: "ملفك",
    o_yourmoy: "معدلك لهذا التخصص",
    o_needed: "أدنى معدل (2025)",
    o_margin: "الفارق",
    o_band_ok: "مرجّح",
    o_band_edge: "على الحدود",
    o_band_no: "غير مرجّح",
    o_band_ok_h: "معدلك يفوق بوضوح المعدل الأدنى لسنة 2025.",
    o_band_edge_h: "معدلك قريب جدًا من المعدل الأدنى لسنة 2025، وقد يتغير من سنة إلى أخرى.",
    o_band_no_h: "معدلك أقل من المعدل الأدنى لسنة 2025.",
    o_places: "مؤسسة متاحة",
    o_see: "عرض التفاصيل",
    o_calc_used: "طريقة الحساب المعتمدة",
    o_again: "تعديل معلوماتي",
    o_reminder: "تذكير: تقدير إرشادي مبني على السنوات الماضية، وليس ضمانًا للتوجيه.",
    empty: "ابدأ بكتابة اسم تخصص (بالعربية أو الفرنسية) أو ميدان.",
    loading: "جارٍ تحميل البيانات…",
    noresults: "لا يوجد تخصص مطابق.",
    error: "تعذّر تحميل البيانات.",
    back: "→ العودة إلى النتائج",
    establishments: "مؤسسة",
    filter_wil: "كل الولايات",
    filter_etb: "التصفية حسب المؤسسة…",
    national: "وطني",
    prio_generic: "المعدل 1 / 2 / 3 حسب الشعبة (غير مفصّل)",
    prio_row_generic: "حسب الشعبة",
    prio_title: "ماذا تعني المعدلات 1 · 2 · 3 ؟",
    calc_base: "أساس الترتيب",
    na: "غير متوفر",
  },
};

/* ---- state ---- */
let DATA = null, FUSE = null, LANG = "fr", STREAM = "", BACWIL = "";
let CURRENT = null;              // selected speciality
const $ = s => document.querySelector(s);
const tr = k => I18N[LANG][k];

/* accent/tashkeel-insensitive fold — mirrors extract.py fold() */
const fold = s => (s || "").normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().trim();

/* ---- boot ---- */
async function init() {
  bindChrome();
  renderState("loading");
  try {
    const res = await fetch("data/data.json", { cache: "force-cache" });
    if (!res.ok) throw new Error(res.status);
    DATA = await res.json();
  } catch (e) {
    renderState("error");
    return;
  }
  // biggest offering first, so common variants lead over niche/ENS codes
  DATA.specialities.sort((a, b) => b.establishments.length - a.establishments.length);
  buildSearch();
  buildStreamPicker();
  buildWilayaPicker();
  buildOrientForm();
  applyLang(LANG);
  renderState("empty");
}

function buildSearch() {
  const docs = DATA.specialities.map(s => ({
    fr: fold(s.filiere_fr),
    ar: fold(s.filiere_ar || ""),
    dom_fr: fold(s.domaine_fr || ""),
    dom_ar: fold(s.domaine_ar || ""),
    ref: s,
  }));
  if (window.Fuse) {
    FUSE = new Fuse(docs, {
      keys: [{ name: "fr", weight: 3 }, { name: "ar", weight: 3 },
             { name: "dom_fr", weight: 1 }, { name: "dom_ar", weight: 1 }],
      threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2,
    });
  }
  FUSE_DOCS = docs;  // fallback source
}
let FUSE_DOCS = [];

function search(q) {
  const fq = fold(q);
  if (fq.length < 2) return [];
  if (FUSE) return FUSE.search(fq, { limit: 12 }).map(r => r.item.ref);
  // fallback: substring
  return FUSE_DOCS
    .filter(d => d.fr.includes(fq) || d.ar.includes(fq) || d.dom_fr.includes(fq) || d.dom_ar.includes(fq))
    .slice(0, 12).map(d => d.ref);
}

/* ---- chrome / language ---- */
function bindChrome() {
  document.querySelectorAll(".lang-toggle button").forEach(b =>
    b.addEventListener("click", () => applyLang(b.dataset.lang)));
  document.querySelectorAll(".tabs button").forEach(b =>
    b.addEventListener("click", () => showTab(b.dataset.tab)));
  $("#oStream").addEventListener("change", renderSubjectInputs);
  $("#orientForm").addEventListener("submit", e => {
    e.preventDefault();
    runOrientation();
  });

  const input = $("#search");
  input.addEventListener("input", onSearchInput);
  input.addEventListener("keydown", onSearchKey);
  document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrap")) hideSuggest();
  });
  $("#streamPick").addEventListener("change", e => {
    STREAM = e.target.value;
    if (CURRENT) renderDetail(CURRENT);
  });
  $("#wilayaPick").addEventListener("change", e => {
    BACWIL = e.target.value;
    if (CURRENT) renderDetail(CURRENT);
  });
}

function applyLang(lang) {
  LANG = lang;
  const rtl = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  document.querySelectorAll(".lang-toggle button")
    .forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = tr(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = tr(el.dataset.i18nPh));
  buildStreamPicker();
  buildWilayaPicker();
  if (DATA) {
    buildOrientForm();
    if ($("#orientResults").innerHTML.trim()) runOrientation();  // re-render in new lang
  }
  if (CURRENT) renderDetail(CURRENT);
  else if (DATA) { const r = $("#results"); if (r.querySelector(".state")) renderState(currentState); }
}

/* origin wilaya of the bachelier — many formations publish a different
   minimum per origin wilaya, so this picks the row that applies to you. */
function buildWilayaPicker() {
  const sel = $("#wilayaPick");
  const list = DATA ? (DATA.meta.origin_wilayas || []) : [];
  sel.innerHTML = `<option value="">${tr("wilaya_any")}</option>` +
    list.map(w => `<option value="${esc(w)}">${esc(w)}</option>`).join("");
  sel.value = BACWIL;
}

function buildStreamPicker() {
  const sel = $("#streamPick");
  const streams = DATA ? DATA.meta.streams : {};
  sel.innerHTML = `<option value="">${tr("stream_any")}</option>` +
    Object.entries(streams).map(([k, v]) =>
      `<option value="${k}">${LANG === "ar" ? v.ar : v.fr}</option>`).join("");
  sel.value = STREAM;
}

/* ---- search box behaviour ---- */
let currentState = "empty";
let sugItems = [], sugIdx = -1;

function onSearchInput(e) {
  const results = search(e.target.value);
  sugItems = results; sugIdx = -1;
  renderSuggest(results);
}
function onSearchKey(e) {
  if ($("#suggest").hidden) return;
  if (e.key === "ArrowDown") { sugIdx = Math.min(sugIdx + 1, sugItems.length - 1); markSug(); e.preventDefault(); }
  else if (e.key === "ArrowUp") { sugIdx = Math.max(sugIdx - 1, 0); markSug(); e.preventDefault(); }
  else if (e.key === "Enter") { if (sugItems.length) select(sugItems[sugIdx < 0 ? 0 : sugIdx]); e.preventDefault(); }
  else if (e.key === "Escape") hideSuggest();
}
function markSug() {
  document.querySelectorAll("#suggest li").forEach((li, i) => li.classList.toggle("active", i === sugIdx));
}
function renderSuggest(list) {
  const ul = $("#suggest");
  if (!list.length) { hideSuggest(); return; }
  ul.innerHTML = list.map(s => {
    const meta = [domLabel(s), scopeLabel(s), `${s.establishments.length} ${tr("establishments")}`]
      .filter(Boolean).map(esc).join(" · ");
    return `<li data-code="${s.code_fil}"><div class="s-fil">${esc(filLabel(s))}</div>` +
      `<div class="s-dom">${meta}</div></li>`;
  }).join("");
  ul.querySelectorAll("li").forEach(li =>
    li.addEventListener("click", () => select(byCode(li.dataset.code))));
  ul.hidden = false;
}
function hideSuggest() { $("#suggest").hidden = true; }
function select(spec) { if (!spec) return; hideSuggest(); $("#search").blur(); renderDetail(spec); }

/* ---- helpers ---- */
const byCode = c => DATA.specialities.find(s => s.code_fil === c);
const esc = s => (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const domLabel = s => (LANG === "ar" ? (s.domaine_ar || s.domaine_fr) : s.domaine_fr) || "";
const streamName = k => { const v = DATA.meta.streams[k]; return v ? (LANG === "ar" ? v.ar : v.fr) : k; };
// speciality display name: Arabic when available in AR mode, else French
const filLabel = s => (LANG === "ar" && s.filiere_ar) ? s.filiere_ar : s.filiere_fr;
const scopeLabel = s => { const v = s.scope && DATA.meta.scopes[s.scope]; return v ? (LANG === "ar" ? v.ar : v.fr) : ""; };
const EPS = 0.005;

/* ---- states ---- */
function renderState(kind) {
  currentState = kind;
  const emoji = { loading: "", empty: "🔍", noresults: "🤷", error: "⚠️" }[kind];
  const body = kind === "loading"
    ? `<div class="spinner"></div>${tr("loading")}`
    : `<span class="emoji">${emoji}</span>${tr(kind)}`;
  $("#results").innerHTML = `<div class="state">${body}</div>`;
}

/* ---- speciality detail ---- */
function renderDetail(spec) {
  CURRENT = spec;
  const years = DATA.meta.years;

  // priority legend: one row per Min column that carries data
  const slots = ["min1", "min2", "min3"];
  const mapped = slots.filter(k => spec.priorities[k]).length;
  const nCols = Math.max(spec.active_mins || 0, mapped);
  const sep = LANG === "ar" ? "، " : ", ";
  let legend;
  if (nCols === 0) {
    legend = `<div class="row"><span class="streams none">${tr("prio_generic")}</span></div>`;
  } else {
    legend = "";
    for (let i = 0; i < nCols; i++) {
      const st = spec.priorities[slots[i]];
      const names = st
        ? `<span class="streams">${esc(st.map(streamName).join(sep))}</span>`
        : `<span class="streams none">${tr("prio_row_generic")}</span>`;
      legend += `<div class="row"><span class="tag m${i + 1}">Min ${i + 1}</span>${names}</div>`;
    }
  }

  // base de classement (weighted vs general average)
  const calc = spec.calc && DATA.meta.calc[spec.calc];
  const calcLine = calc
    ? `<div class="calc"><span class="calc-lbl">${tr("calc_base")} :</span> ${esc(LANG === "ar" ? calc.ar : calc.fr)}</div>`
    : "";

  // wilaya options
  const wilayas = [...new Set(spec.establishments.map(e => e.wilaya).filter(Boolean))].sort();
  const wilOpts = `<option value="">${tr("filter_wil")}</option>` +
    wilayas.map(w => `<option value="${esc(w)}">${esc(w)}</option>`).join("");

  $("#results").innerHTML = `
    <div class="detail-head">
      <button class="back" id="back">${tr("back")}</button>
      <h2>${esc(filLabel(spec))}</h2>
      <div class="dom">${[
        (LANG === "ar" && spec.filiere_ar) ? spec.filiere_fr : "",
        domLabel(spec), scopeLabel(spec), spec.code_fil,
      ].filter(Boolean).map(esc).join(" · ")}</div>
      <div class="legend" title="${tr("prio_title")}">${legend}</div>
      ${calcLine}
    </div>
    <div class="filters">
      <input id="fEtb" type="search" placeholder="${tr("filter_etb")}">
      <select id="fWil">${wilOpts}</select>
    </div>
    <div class="count" id="count"></div>
    <div class="etb-list" id="etbList"></div>`;

  $("#back").addEventListener("click", backToResults);
  $("#fEtb").addEventListener("input", renderEtbList);
  $("#fWil").addEventListener("change", renderEtbList);
  renderEtbList();
}

function backToResults() {
  CURRENT = null;
  const q = $("#search").value;
  const list = search(q);
  if (q.trim().length >= 2 && !list.length) renderState("noresults");
  else if (!q.trim()) renderState("empty");
  else { renderState("empty"); renderSuggest(list); $("#search").focus(); }
}

/* which min slot matches the selected stream (for highlight + trend) */
function primaryKey(spec) {
  if (STREAM) {
    for (const k of ["min1", "min2", "min3"]) {
      const st = spec.priorities[k];
      if (st && st.includes(STREAM)) return k;
    }
    return null;               // this speciality doesn't admit the chosen stream
  }
  return "min1";
}

function renderEtbList() {
  const spec = CURRENT;
  const years = DATA.meta.years;
  const pkey = primaryKey(spec);
  const qEtb = fold($("#fEtb").value);
  const wil = $("#fWil").value;

  let list = spec.establishments.filter(e => {
    // origin-wilaya quota rows: keep the one for your BAC wilaya, plus rows
    // that are open to everyone (no origin restriction).
    if (BACWIL && e.pour_bacheliers && e.pour_bacheliers !== BACWIL) return false;
    if (wil && e.wilaya !== wil) return false;
    if (qEtb && !fold(e.etablissement_fr).includes(qEtb)) return false;
    return true;
  });

  $("#count").textContent = `${list.length} ${tr("establishments")}`;

  $("#etbList").innerHTML = list.map(e => {
    const cells = years.map(y => yearCell(e.years[y], pkey, y)).join("");
    const trend = trendArrow(e, years, pkey);
    const origin = e.pour_bacheliers
      ? `<span class="etb-origin">${tr("pour_bacheliers")} ${esc(e.pour_bacheliers)}</span>`
      : `<span class="etb-origin open">${tr("open_all")}</span>`;
    return `<div class="etb">
      <div class="etb-top">
        <span class="etb-name">${esc(e.etablissement_fr)}${trend}</span>
        <span class="etb-wil">${e.wilaya ? esc(e.wilaya) : tr("national")}</span>
      </div>
      <div class="etb-sub">${origin}</div>
      <div class="years">${cells}</div>
    </div>`;
  }).join("");
}

function yearCell(yv, pkey, yearLabel) {
  const slots = ["min1", "min2", "min3"];
  const lines = slots.map((k, i) => {
    const v = yv[k];
    if (v === null || v === undefined) return "";
    // emphasise the line matching the student's chosen stream
    const hi = (STREAM && k === pkey) ? " hi" : "";
    return `<div class="mline${hi}"><span class="dot m${i + 1}"></span>` +
      `<span class="val">${v.toFixed(2)}</span></div>`;
  }).filter(Boolean).join("");
  const body = lines || `<div class="mline"><span class="na">${tr("na")}</span></div>`;
  return `<div class="yr"><div class="y">${yearLabel}</div>` +
    `<div class="mins">${body}</div></div>`;
}

/* ============================================================
   Orientation tab — estimate which specialities are reachable.
   All numbers here are indicative: the published minima are the
   OUTCOME of a given year's demand and capacity, not a threshold.
   ============================================================ */

const OSTATE = { stream: "", wilaya: "", mg: null, marks: {} };
const BAND_EDGE = 0.5;   // within .5 pt of the 2025 minimum = too close to call

/* which calc rule applies to this speciality for a given branch */
function calcRule(spec, branch) {
  const rules = spec.calc_key && DATA.meta.calc_rules[spec.calc_key];
  if (!rules) return null;
  return rules.find(r => r.branches.includes(branch)) || null;
}

/* Subjects the user must supply. Only look at specialities this branch can
   actually be admitted to — a calc rule may list every stream, but a Lettres
   candidate is never admitted to Sciences & Technologies, so never ask them
   for a Physique mark. */
function neededSubjects(branch) {
  const need = new Set();
  for (const s of DATA.specialities) {
    if (!branchKey(s, branch)) continue;
    const r = calcRule(s, branch);
    if (!r) continue;
    for (const k of Object.keys(r.terms)) if (k !== "mg") need.add(k);
  }
  return [...need];
}

/* Σ(weight × value) / divisor -> null if a required mark is missing */
function moyenneFor(spec, branch, mg, marks) {
  const r = calcRule(spec, branch);
  if (!r) return null;
  let sum = 0;
  for (const [k, w] of Object.entries(r.terms)) {
    const v = k === "mg" ? mg : marks[k];
    if (v === null || v === undefined || v === "") return null;
    sum += w * Number(v);
  }
  return { value: sum / r.divisor, rule: r };
}

/* the min column matching the user's branch */
function branchKey(spec, branch) {
  for (const k of ["min1", "min2", "min3"]) {
    const st = spec.priorities[k];
    if (st && st.includes(branch)) return k;
  }
  return null;
}

function buildOrientForm() {
  const st = $("#oStream"), wl = $("#oWilaya");
  st.innerHTML = `<option value="">${tr("o_pick")}</option>` +
    Object.entries(DATA.meta.streams).map(([k, v]) =>
      `<option value="${k}">${esc(LANG === "ar" ? v.ar : v.fr)}</option>`).join("");
  wl.innerHTML = `<option value="">${tr("o_pick")}</option>` +
    DATA.meta.origin_wilayas.map(w => `<option value="${esc(w)}">${esc(w)}</option>`).join("");
  st.value = OSTATE.stream; wl.value = OSTATE.wilaya;
  if (OSTATE.mg !== null) $("#oMg").value = OSTATE.mg;
  renderSubjectInputs();
}

/* only ask for marks the user's branch can actually need */
function renderSubjectInputs() {
  const box = $("#oSubjects");
  const branch = $("#oStream").value;
  if (!branch) { box.innerHTML = ""; return; }
  const subs = neededSubjects(branch);
  box.innerHTML = subs.map(k => {
    const s = DATA.meta.subjects[k];
    return `<div class="ofield">
      <label for="om_${k}">${esc(LANG === "ar" ? s.ar : s.fr)}</label>
      <input id="om_${k}" data-sub="${k}" type="number" inputmode="decimal"
             step="0.01" min="0" max="20" placeholder="—"
             value="${OSTATE.marks[k] ?? ""}">
    </div>`;
  }).join("");
}

function readOrientForm() {
  OSTATE.stream = $("#oStream").value;
  OSTATE.wilaya = $("#oWilaya").value;
  const mg = parseFloat($("#oMg").value);
  OSTATE.mg = Number.isFinite(mg) ? mg : null;
  OSTATE.marks = {};
  document.querySelectorAll("#oSubjects input[data-sub]").forEach(i => {
    const v = parseFloat(i.value);
    if (Number.isFinite(v)) OSTATE.marks[i.dataset.sub] = v;
  });
}

function runOrientation() {
  readOrientForm();
  const box = $("#orientResults");
  const { stream, wilaya, mg, marks } = OSTATE;
  if (!stream || !wilaya || mg === null) {
    box.innerHTML = `<div class="state"><span class="emoji">📝</span>${tr("o_empty")}</div>`;
    return;
  }

  const rows = [];
  for (const spec of DATA.specialities) {
    const bkey = branchKey(spec, stream);
    if (!bkey) continue;                       // branch not admitted here
    const m = moyenneFor(spec, stream, mg, marks);
    if (!m) continue;                          // needs a mark not supplied

    // establishments open to this candidate's origin wilaya
    const opts = spec.establishments.filter(e =>
      !e.pour_bacheliers || e.pour_bacheliers === wilaya);
    const mins = opts.map(e => e.years["2025"]?.[bkey])
                     .filter(v => v !== null && v !== undefined);
    if (!mins.length) continue;                // no 2025 reference for this branch
    const lowest = Math.min(...mins);
    const margin = m.value - lowest;
    const band = margin >= BAND_EDGE ? "ok" : margin > -BAND_EDGE ? "edge" : "no";
    const reachable = opts.filter(e => {
      const v = e.years["2025"]?.[bkey];
      return v !== null && v !== undefined && m.value >= v - BAND_EDGE;
    }).length;
    rows.push({ spec, moy: m.value, rule: m.rule, lowest, margin, band, reachable,
                total: opts.length, bkey });
  }

  if (!rows.length) {
    box.innerHTML = `<div class="state"><span class="emoji">🤷</span>${tr("o_none")}</div>`;
    return;
  }
  rows.sort((a, b) => b.margin - a.margin);
  renderOrientResults(rows);
}

function ruleLabel(rule) {
  const parts = Object.entries(rule.terms).map(([k, w]) => {
    const name = k === "mg" ? tr("o_mg")
      : (LANG === "ar" ? DATA.meta.subjects[k].ar : DATA.meta.subjects[k].fr);
    return w === 1 ? name : `${name} × ${w}`;
  });
  return rule.divisor === 1 ? parts[0] : `( ${parts.join(" + ")} ) ÷ ${rule.divisor}`;
}

function renderOrientResults(rows) {
  const stream = streamName(OSTATE.stream);
  const head = `
    <div class="orecap">
      <strong>${tr("o_recap")}:</strong> ${esc(stream)} · ${esc(OSTATE.wilaya)} ·
      ${tr("o_mg")} ${OSTATE.mg.toFixed(2)}
      <button class="back" id="oAgain">${tr("o_again")}</button>
    </div>
    <p class="warn small" role="note">${tr("o_reminder")}</p>
    <div class="count">${rows.length} ${tr("o_results")}</div>`;

  const cards = rows.map(r => `
    <div class="ocard band-${r.band}">
      <div class="ocard-top">
        <span class="etb-name">${esc(filLabel(r.spec))}</span>
        <span class="badge b-${r.band}" title="${esc(tr("o_band_" + r.band + "_h"))}">${tr("o_band_" + r.band)}</span>
      </div>
      <div class="s-dom">${esc(domLabel(r.spec))}</div>
      <div class="onums">
        <div><span class="ok-l">${tr("o_yourmoy")}</span><b>${r.moy.toFixed(2)}</b></div>
        <div><span class="ok-l">${tr("o_needed")}</span><b>${r.lowest.toFixed(2)}</b></div>
        <div><span class="ok-l">${tr("o_margin")}</span>
             <b class="${r.margin >= 0 ? "pos" : "neg"}">${r.margin >= 0 ? "+" : ""}${r.margin.toFixed(2)}</b></div>
      </div>
      <div class="ofoot">
        <span>${r.reachable} / ${r.total} ${tr("o_places")}</span>
        <button class="linkish" data-code="${esc(r.spec.code_fil)}">${tr("o_see")}</button>
      </div>
      <div class="ocalc"><span class="ok-l">${tr("o_calc_used")}:</span> ${esc(ruleLabel(r.rule))}</div>
    </div>`).join("");

  $("#orientResults").innerHTML = head + `<div class="etb-list">${cards}</div>`;
  $("#oAgain").addEventListener("click", () => {
    $("#orientResults").innerHTML = ""; $("#oStream").focus();
  });
  document.querySelectorAll("#orientResults .linkish").forEach(b =>
    b.addEventListener("click", () => {
      showTab("search");
      STREAM = OSTATE.stream; BACWIL = OSTATE.wilaya;
      $("#streamPick").value = STREAM; $("#wilayaPick").value = BACWIL;
      renderDetail(byCode(b.dataset.code));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));
}

function showTab(name) {
  const isSearch = name === "search";
  $("#panelSearch").hidden = !isSearch;
  $("#panelOrient").hidden = isSearch;
  $("#tabSearch").classList.toggle("active", isSearch);
  $("#tabOrient").classList.toggle("active", !isSearch);
  $("#tabSearch").setAttribute("aria-selected", String(isSearch));
  $("#tabOrient").setAttribute("aria-selected", String(!isSearch));
}

/* trend on the primary min across years: latest vs previous available */
function trendArrow(e, years, pkey) {
  if (!pkey) return "";
  const vals = years.map(y => e.years[y][pkey]).filter(v => v != null);
  if (vals.length < 2) return "";
  const d = vals[vals.length - 1] - vals[vals.length - 2];
  const cls = d > EPS ? "up" : d < -EPS ? "down" : "flat";
  const arr = d > EPS ? "↑" : d < -EPS ? "↓" : "→";
  return `<span class="trend ${cls}" title="${d >= 0 ? "+" : ""}${d.toFixed(2)}">${arr}</span>`;
}

/* start after all declarations are evaluated */
init();
