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
    footer: "Données : moyennes minimales d'affectation (MESRS). Application non officielle.",
    sources: "Fichiers sources :",
    circulaire: "Circulaire",
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
    prio_title: "Que signifient Min 1 · 2 · 3 ?",
    na: "n.d.",
  },
  ar: {
    title: "المعدلات الدنيا للبكالوريا",
    hero_title: "ابحث عن المعدل الأدنى للالتحاق بشعبتك",
    hero_sub: "بكالوريا 2023 · 2024 · 2025 — ابحث عن تخصص.",
    search_ph: "اكتب اسم التخصص (بالفرنسية) أو الميدان…",
    your_stream: "شعبتك في البكالوريا:",
    stream_any: "— الكل —",
    footer: "البيانات: المعدلات الدنيا للتوجيه (وزارة التعليم العالي). تطبيق غير رسمي.",
    sources: "الملفات المصدر:",
    circulaire: "المنشور",
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
    prio_title: "ماذا تعني المعدلات 1 · 2 · 3 ؟",
    na: "غير متوفر",
  },
};

/* ---- state ---- */
let DATA = null, FUSE = null, LANG = "fr", STREAM = "";
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
  if (CURRENT) renderDetail(CURRENT);
  else if (DATA) { const r = $("#results"); if (r.querySelector(".state")) renderState(currentState); }
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

  // priority legend
  const slots = ["min1", "min2", "min3"];
  const hasPrio = slots.some(k => spec.priorities[k]);
  let legend;
  if (!hasPrio) {
    legend = `<div class="row"><span class="streams none">${tr("prio_generic")}</span></div>`;
  } else {
    legend = slots.map((k, i) => {
      const st = spec.priorities[k];
      if (!st) return "";
      const names = st.map(streamName).join(LANG === "ar" ? "، " : ", ");
      return `<div class="row"><span class="tag m${i + 1}">Min ${i + 1}</span>` +
        `<span class="streams">${esc(names)}</span></div>`;
    }).join("");
  }

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
    if (wil && e.wilaya !== wil) return false;
    if (qEtb && !fold(e.etablissement_fr).includes(qEtb)) return false;
    return true;
  });

  $("#count").textContent = `${list.length} ${tr("establishments")}`;

  $("#etbList").innerHTML = list.map(e => {
    const cells = years.map(y => yearCell(e.years[y], pkey, y)).join("");
    const trend = trendArrow(e, years, pkey);
    return `<div class="etb">
      <div class="etb-top">
        <span class="etb-name">${esc(e.etablissement_fr)}${trend}</span>
        <span class="etb-wil">${e.wilaya ? esc(e.wilaya) : tr("national")}</span>
      </div>
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
