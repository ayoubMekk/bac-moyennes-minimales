#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract Algerian BAC minimum admission averages into data/data.json.

Parses the 3 year PDFs (moy_min_bac2023/24/25) with pdfplumber and attaches
the Min1/Min2/Min3 -> bac-stream priority mapping worked out from circulaire.pdf.

The priority mapping is a small hand-verified reference table (see PRIORITY_MAP),
NOT parsed live from the 200-page circulaire. It is keyed by the first letter of
code_fil (= domaine) plus, for languages, the H## sub-code.

Run:  python scripts/extract.py
"""
import json, re, sys, unicodedata, collections, datetime
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parent.parent
FILES = ROOT / "files"
OUT = ROOT / "data" / "data.json"
YEARS = ["2023", "2024", "2025"]

# --- reference data (from circulaire.pdf, page 4) --------------------------

STREAMS = {
    "sciexp":   {"fr": "Sciences Expérimentales", "ar": "علوم تجريبية"},
    "math":     {"fr": "Mathématiques",           "ar": "رياضيات"},
    "techmath": {"fr": "Technique Mathématique",  "ar": "تقني رياضي"},
    "lettres":  {"fr": "Lettres et Philosophie",  "ar": "آداب وفلسفة"},
    "langues":  {"fr": "Langues Étrangères",      "ar": "لغات أجنبية"},
    "gestion":  {"fr": "Gestion et Économie",     "ar": "تسيير واقتصاد"},
    "arts":     {"fr": "Arts",                    "ar": "فنون"},
}
ALL_STREAMS = list(STREAMS.keys())

DOMAINES = {
    "A": {"fr": "Sciences & Technologies",       "ar": "علوم وتكنولوجيا"},
    "B": {"fr": "Sciences de la Matière",        "ar": "علوم المادة"},
    "C": {"fr": "Mathématiques & Informatique",  "ar": "رياضيات وإعلام آلي"},
    "D": {"fr": "Sciences de la Nature & de la Vie", "ar": "علوم الطبيعة والحياة"},
    "E": {"fr": "Sciences de la Terre & Univers","ar": "علوم الأرض والكون"},
    "F": {"fr": "Éco, Gestion & Commerce",       "ar": "علوم اقتصادية، تسيير وتجارية"},
    "G": {"fr": "Droit & Sciences Politiques",   "ar": "حقوق وعلوم سياسية"},
    "H": {"fr": "Lettres & Langues Étrangères",  "ar": "آداب ولغات أجنبية"},
    "I": {"fr": "Sciences Humaines & Sociales",  "ar": "علوم إنسانية واجتماعية"},
    "J": {"fr": "STAPS",                         "ar": "النشاطات البدنية والرياضية"},
    "K": {"fr": "Arts",                          "ar": "فنون"},
    "L": {"fr": "Langue & Littérature Arabes",   "ar": "لغة وأدب عربي"},
    "M": {"fr": "Langue & Culture Amazighes",    "ar": "لغة وثقافة أمازيغية"},
    "N": {"fr": "Architecture & Urbanisme",      "ar": "هندسة معمارية وعمران"},
    "P": {"fr": "Sciences de la Santé",          "ar": "علوم الصحة"},
}

# domaine letter -> ordered list of priority slots (min1, min2, min3);
# each slot is a list of stream keys sharing that priority.
PRIORITY_MAP = {
    "A": [["math", "sciexp", "techmath"]],
    "B": [["sciexp", "math"], ["techmath"]],
    "C": [["math"], ["sciexp", "techmath"]],
    "D": [["sciexp", "math"], ["techmath"]],
    "E": [["sciexp", "math"], ["techmath"]],
    "F": [["gestion", "lettres"], ["math", "sciexp", "techmath"], ["langues"]],
    "G": [["lettres", "langues", "gestion", "arts"], ["sciexp", "math"], ["techmath"]],
    "I": [["lettres", "langues", "arts"], ["sciexp"]],
    "J": [ALL_STREAMS],
    "K": [["arts"], ["sciexp", "math", "techmath", "lettres", "langues", "gestion"]],
    "L": [["lettres", "langues", "arts"], ["sciexp", "gestion"]],
    "M": [["lettres", "langues", "arts"], ["sciexp", "gestion"]],
    "N": [["math", "techmath"]],   # Sci.Exp inclusion uncertain in circulaire
    "P": [["sciexp", "math"], ["techmath"]],
}
# H (languages) split by H## sub-code.
H_LANG_A = [["langues"], ["lettres"], ["sciexp", "gestion", "arts"]]        # FR/EN/ES/DE
H_LANG_IT = [["langues"], ["lettres"], ["sciexp", "math", "techmath", "gestion", "arts"]]
H_LANG_B = [["langues", "lettres"], ["sciexp", "gestion", "arts"]]          # RU/ZH/TR
H_SUBMAP = {
    "01": H_LANG_A, "06": H_LANG_A, "02": H_LANG_A, "04": H_LANG_A,  # FR EN ES DE
    "07": H_LANG_IT,                                                  # IT
    "05": H_LANG_B, "09": H_LANG_B, "08": H_LANG_B, "03": H_LANG_B,  # ZH TR RU ...
}

def priority_slots(code_fil):
    """Return list of slots (each a list of stream keys) for a code_fil, or None."""
    letter = code_fil[0]
    if letter == "H":
        return H_SUBMAP.get(code_fil[1:3], H_LANG_A)
    return PRIORITY_MAP.get(letter)

# --- wilaya derivation (best-effort from establishment name) ---------------

WILAYAS = [  # longest phrases first so multi-word names win
    "OUM EL BOUAGHI", "SIDI BEL ABBES", "BORDJ BOU ARRERIDJ", "BORDJ BADJI MOKHTAR",
    "OULED DJELLAL", "SOUK AHRAS", "AIN TEMOUCHENT", "AIN DEFLA", "EL BAYADH",
    "EL TARF", "EL OUED", "EL MGHAIR", "EL MENIA", "IN SALAH", "IN GUEZZAM",
    "BENI ABBES", "TIZI OUZOU", "TAMANRASSET", "TAMANGHASSET", "MOSTAGANEM",
    "KHENCHELA", "TISSEMSILT", "BOUMERDES", "TIMIMOUN", "TOUGGOURT", "GHARDAIA",
    "RELIZANE", "TLEMCEN", "MASCARA", "OUARGLA", "TEBESSA", "LAGHOUAT", "GUELMA",
    "SKIKDA", "DJELFA", "BATNA", "BLIDA", "BOUIRA", "BISKRA", "BECHAR", "BEJAIA",
    "TIARET", "SETIF", "SAIDA", "ANNABA", "MEDEA", "TINDOUF", "KHENCHELA",
    "CONSTANTINE", "MOSTAGANEM", "TIPAZA", "JIJEL", "CHLEF", "ADRAR", "ALGER",
    "ORAN", "MILA", "NAAMA", "MSILA", "M SILA", "ILLIZI", "DJANET", "MENEA",
]
_WIL_RE = [(w, re.compile(r"\b" + re.escape(w) + r"\b")) for w in WILAYAS]

# sub-city / campus names -> their wilaya (for names that don't contain the seat)
CITY_ALIASES = {
    "USTHB": "ALGER", "BOUZAREAH": "ALGER", "KOUBA": "ALGER",
    "BAB EZZOUAR": "ALGER", "BEN AKNOUN": "ALGER", "DELY IBRAHIM": "ALGER",
    "KHEMIS MILIANA": "AIN DEFLA", "BOU SAADA": "MSILA", "BARIKA": "BATNA",
    "AFLOU": "LAGHOUAT", "MAGHNIA": "TLEMCEN", "EL KHARROUBA": "BOUMERDES",
    "EMIR": "CONSTANTINE", "AKID": "ORAN",
}

def _pretty(w):
    return w.title().replace("M Sila", "M'Sila").replace("Msila", "M'Sila")

def derive_wilaya(name_norm):
    if "RECRUTEMENT NATIONAL" in name_norm:
        return None  # national recruitment, no single wilaya
    for w, rx in _WIL_RE:
        if rx.search(name_norm):
            return _pretty(w)
    for city, wil in CITY_ALIASES.items():
        if city in name_norm:
            return _pretty(wil)
    return None

# --- parsing ---------------------------------------------------------------

def norm_ws(s):
    return re.sub(r"\s+", " ", (s or "").replace("\n", " ")).strip()

def parse_min(v):
    v = (v or "").strip()
    if v in ("", "--", "—", "-", "/"):
        return None
    try:
        return round(float(v.replace(",", ".")), 2)
    except ValueError:
        return None

def parse_year(path):
    """Yield (code_etb, etb_fr, code_fil, filiere_fr, [min1,min2,min3]) rows."""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                for row in table:
                    if not row or len(row) < 7:
                        continue
                    code_etb = norm_ws(row[0])
                    code_fil = norm_ws(row[2])
                    if not code_fil or code_fil == "Code Fil" or code_etb == "Code":
                        continue
                    if not re.match(r"^[A-Z0-9]{3,}$", code_fil):
                        continue
                    yield (
                        code_etb,
                        norm_ws(row[1]),
                        code_fil,
                        norm_ws(row[3]),
                        [parse_min(row[4]), parse_min(row[5]), parse_min(row[6])],
                    )

# --- normalisation for search ---------------------------------------------

def fold(s):
    """Lowercase, strip accents -> accent-insensitive search key."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.lower().strip()

# --- circulaire index: code_fil -> Arabic name + inscription scope ----------
# Only the "فهرس" (index) sections are parsed — they are the clean, tabular part.
# Arabic runs come out reversed (visual order); NFKC + reverse restores them.
# Latin codes come out already correct, so they are matched as-is.

CIRC = FILES / "circulaire.pdf"
CODE_RE = re.compile(r"^[A-Z]\d\d[A-Z]{3}\d\d$")
SCOPES = {
    "local_regional": {"fr": "Inscription locale / régionale", "ar": "تسجيل محلي أو جهوي"},
    "national":       {"fr": "Inscription nationale",          "ar": "تسجيل وطني"},
}
_AR_STOP = ("تسجيل", "الشهادة", "طبيعة", "تكوينات", "الوصف", "فهرس",
            "الميدان", "البكالوريا", "التعليم")

def _rev(s):
    return unicodedata.normalize("NFKC", s or "")[::-1]

def _is_arabic(s):
    return bool(s) and any("؀" <= ch <= "ۿ" for ch in s)

def _clean_ar(s):
    parts = [p.strip() for p in (s or "").split("\n") if p.strip()]
    return " ".join(reversed(parts)) if len(parts) > 1 else (parts[0] if parts else s)

def parse_circulaire_index(path=CIRC):
    """Return (code2ar, code2scope) harvested from the circulaire index pages."""
    code2ar, code2scope = {}, {}
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            ftxt = _rev(page.extract_text() or "")
            if "فهرس" not in ftxt or "الرمز" not in ftxt:
                continue
            for table in page.extract_tables():
                ncol = max((len(r) for r in table), default=0)
                if not ncol:
                    continue
                col_hits = [0] * ncol
                for r in table:
                    for ci, c in enumerate(r):
                        if ci < ncol and c and CODE_RE.match(c.strip()):
                            col_hits[ci] += 1
                if not any(col_hits):
                    continue
                code_col = max(range(ncol), key=lambda i: col_hits[i])
                cur_name = cur_scope = None
                for r in table:
                    joined = " ".join(x for x in r if x)
                    hay = joined + " " + _rev(joined)  # markers may be reversed
                    if "NRF" in hay or "FRN" in hay:
                        cur_scope = "national"
                    elif any(m in hay for m in ("LRF", "RRF", "FRL", "FRR")):
                        cur_scope = "local_regional"
                    names = [_clean_ar(_rev(c)) for ci, c in enumerate(r)
                             if c and ci != code_col and _is_arabic(c)
                             and not any(w in _rev(c) for w in _AR_STOP)]
                    names = [n for n in names if 2 <= len(n) <= 60]
                    if names:
                        cur_name = min(names, key=len)
                    code = r[code_col].strip() if code_col < len(r) and r[code_col] else None
                    if code and CODE_RE.match(code):
                        if cur_name:
                            code2ar[code] = cur_name
                        if cur_scope:
                            code2scope[code] = cur_scope
    return code2ar, code2scope

# --- build -----------------------------------------------------------------

def build():
    # spec[code_fil] -> {filiere names counter, estabs: {code_etb: {...}}}
    specs = {}
    counts = {}
    warnings = collections.Counter()

    for year in YEARS:
        path = FILES / f"moy_min_bac{year}.pdf"
        n = 0
        for code_etb, etb_fr, code_fil, fil_fr, mins in parse_year(path):
            n += 1
            spec = specs.setdefault(code_fil, {
                "names": collections.Counter(), "estabs": {}})
            if fil_fr:
                spec["names"][fil_fr] += 1
            est = spec["estabs"].setdefault(code_etb, {
                "code_etb": code_etb, "names": collections.Counter(),
                "years": {}})
            if etb_fr:
                est["names"][etb_fr] += 1
            est["years"][year] = {"min1": mins[0], "min2": mins[1], "min3": mins[2]}
        counts[year] = n
        print(f"  {year}: {n} data rows")

    code2ar, code2scope = parse_circulaire_index()

    def fname(spec):
        return spec["names"].most_common(1)[0][0] if spec["names"] else None

    # Merge code_fil variants that are the same speciality: same name, same
    # domaine (1st letter) and same nature/scope segment (chars 4-6, e.g. LAL).
    # These differ only by registration sub-scope and never share an
    # establishment within a group, so merging is lossless.
    groups = collections.OrderedDict()
    for code_fil, spec in sorted(specs.items()):
        fn = fname(spec) or code_fil
        key = (fold(fn), code_fil[0], code_fil[3:6])
        groups.setdefault(key, []).append(code_fil)

    # folded filiere name -> Arabic name (majority vote over codes found in index)
    fr2ar = collections.defaultdict(collections.Counter)
    for codes in groups.values():
        fn = fname(specs[codes[0]]) or codes[0]
        for c in codes:
            if code2ar.get(c):
                fr2ar[fold(fn)][code2ar[c]] += 1
    fr2ar = {k: v.most_common(1)[0][0] for k, v in fr2ar.items()}

    specialities = []
    for (fkey, letter, seg), codes in groups.items():
        rep = max(codes, key=lambda c: len(specs[c]["estabs"]))  # largest variant
        # display name = majority across the group
        name_votes = collections.Counter()
        for c in codes:
            fn = fname(specs[c])
            if fn:
                name_votes[fn] += len(specs[c]["estabs"])
        filiere_fr = name_votes.most_common(1)[0][0] if name_votes else rep
        dom = DOMAINES.get(letter)
        slots = priority_slots(rep)
        if slots is None:
            warnings["unmapped_domaine"] += 1
        priorities = {f"min{i+1}": (slots[i] if slots and i < len(slots) else None)
                      for i in range(3)}

        # merge establishments across the grouped codes (fill nulls, no dup rows)
        merged = collections.OrderedDict()
        for c in codes:
            for code_etb, est in specs[c]["estabs"].items():
                m = merged.setdefault(code_etb, {"names": collections.Counter(), "years": {}})
                m["names"].update(est["names"])
                for y, yv in est["years"].items():
                    cur = m["years"].get(y)
                    if cur is None:
                        m["years"][y] = dict(yv)
                    else:
                        for k in ("min1", "min2", "min3"):
                            if cur[k] is None and yv[k] is not None:
                                cur[k] = yv[k]

        estabs, max_populated = [], 0
        for code_etb, m in sorted(merged.items()):
            etb_fr = m["names"].most_common(1)[0][0] if m["names"] else code_etb
            years = {y: m["years"].get(y, {"min1": None, "min2": None, "min3": None})
                     for y in YEARS}
            for yv in years.values():
                max_populated = max(max_populated,
                                    sum(1 for k in ("min1", "min2", "min3") if yv[k] is not None))
            estabs.append({
                "code_etb": code_etb,
                "etablissement_fr": etb_fr,
                "wilaya": derive_wilaya(fold(etb_fr).upper()),
                "years": years,
            })

        if slots is not None and max_populated > len(slots):
            warnings["min_cols_exceed_priorities"] += 1

        scope_votes = collections.Counter(code2scope[c] for c in codes if code2scope.get(c))
        scope = scope_votes.most_common(1)[0][0] if scope_votes else None
        filiere_ar = fr2ar.get(fold(filiere_fr))

        specialities.append({
            "code_fil": rep,
            "codes": sorted(codes),
            "filiere_fr": filiere_fr,
            "filiere_ar": filiere_ar,
            "domaine_letter": letter,
            "domaine_fr": dom["fr"] if dom else None,
            "domaine_ar": dom["ar"] if dom else None,
            "nature": seg,
            "scope": scope,
            "priorities": priorities,
            "search": fold(filiere_fr),
            "search_ar": filiere_ar or "",
            "establishments": estabs,
        })

    specialities.sort(key=lambda s: -len(s["establishments"]))
    ar_named = sum(1 for s in specialities if s["filiere_ar"])
    data = {
        "meta": {
            "years": YEARS,
            "generated": datetime.date.today().isoformat(),
            "streams": STREAMS,
            "scopes": SCOPES,
            "row_counts": counts,
            "speciality_count": len(specialities),
            "specialities_with_arabic": ar_named,
            "warnings": dict(warnings),
        },
        "specialities": specialities,
    }
    return data

def validate(data):
    print("\nValidation:")
    for y, c in data["meta"]["row_counts"].items():
        print(f"  rows {y}: {c}")
    print(f"  specialities (merged): {data['meta']['speciality_count']}")
    print(f"  with Arabic name: {data['meta']['specialities_with_arabic']}")
    with_scope = sum(1 for s in data["specialities"] if s["scope"])
    print(f"  with inscription scope: {with_scope}")
    est_total = sum(len(s["establishments"]) for s in data["specialities"])
    print(f"  speciality×establishment pairs: {est_total}")
    no_wilaya = sum(1 for s in data["specialities"]
                    for e in s["establishments"] if e["wilaya"] is None)
    print(f"  establishment rows without wilaya: {no_wilaya}")
    if data["meta"]["warnings"]:
        print(f"  ANOMALIES: {data['meta']['warnings']}")

def main():
    print("Extracting...")
    data = build()
    validate(data)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")),
                   encoding="utf-8")
    print(f"\nWrote {OUT} ({OUT.stat().st_size//1024} KiB)")

    # ponytail self-check: known anchor values must survive the pipeline
    by_code = {c: s for s in data["specialities"] for c in s["codes"]}
    med = by_code["P01MAL01"]
    c99 = next(e for e in med["establishments"] if e["code_etb"] == "C99")
    assert c99["years"]["2023"]["min1"] == 16.52, c99["years"]["2023"]
    assert c99["years"]["2025"]["min1"] == 16.65
    assert by_code["A00LAL01"]["priorities"]["min1"] == ["math", "sciexp", "techmath"]
    assert by_code["A00LAL01"]["priorities"]["min2"] is None
    assert by_code["G02LAL01"]["priorities"]["min3"] == ["techmath"]
    # merge worked: the 3 academic-Droit variants collapsed into one speciality
    droit_lal = by_code["G02LAL01"]
    assert set(droit_lal["codes"]) >= {"G02LAL01", "G02LAL02", "G02LAL03"}, droit_lal["codes"]
    assert droit_lal["filiere_ar"] == "حقوق", droit_lal["filiere_ar"]
    assert all(c > 3000 for c in data["meta"]["row_counts"].values())
    print("Self-check OK.")

if __name__ == "__main__":
    main()
