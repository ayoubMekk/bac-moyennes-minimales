# Moyennes minimales BAC — Algérie

Recherche des **moyennes minimales d'accès** aux filières universitaires
algériennes (BAC 2023 · 2024 · 2025). Application 100 % statique, déployable
sur GitHub Pages, fonctionnant hors-ligne une fois chargée.

**Application non officielle.** Données extraites des documents publics du MESRS.

---

## 🇫🇷 Français

### Structure

```
index.html · app.js · style.css   → le front-end (aucun build)
data/data.json                     → données générées
scripts/extract.py                 → extracteur PDF → JSON
files/*.pdf                        → sources (3 années + circulaire)
.github/workflows/extract.yml      → régénère data.json quand un PDF change
```

### Que signifient Min 1 / Min 2 / Min 3 ?

Ce ne sont **pas** des séries fixes du BAC : ce sont des **rangs de priorité**.
Pour chaque filière, la série du BAC correspondant à chaque rang dépend de son
**domaine** (déduit de la 1re lettre du `code_fil`). La correspondance
domaine → série est tirée de `circulaire.pdf` (page 4) et codée dans
`PRIORITY_MAP` de `scripts/extract.py`.

Exemple — Droit (domaine G) :
`Min 1` = Lettres & Philo / Langues / Gestion & Éco / Arts · `Min 2` = Sci. Exp.
/ Maths · `Min 3` = Technique Mathématique. Une filière ne remplit que le nombre
de colonnes Min correspondant à ses rangs.

### Lancer en local

```bash
python -m http.server 8000     # puis ouvrir http://localhost:8000
```

### Régénérer les données

```bash
pip install -r scripts/requirements.txt
python scripts/extract.py       # écrit data/data.json + rapport de validation
```

### Ajouter une nouvelle année (ex. 2026)

1. Déposer le PDF dans `files/moy_min_bac2026.pdf` (même format de tableau :
   `Code Etb · Etablissement · Code Fil · Filiere · Min1 · Min2 · Min3`).
2. Ajouter `"2026"` à la liste `YEARS` en haut de `scripts/extract.py`.
3. Relancer `python scripts/extract.py` (ou laisser l'action GitHub le faire).
4. Le front-end s'adapte automatiquement au nombre d'années.

### Déploiement (GitHub Pages)

Tout est à la racine → Settings ▸ Pages ▸ *Deploy from branch* ▸ `main` / `/`.
Le `fetch` de `data.json` utilise un chemin relatif : fonctionne aussi sous
sous-répertoire (`user.github.io/repo/`).

### Variantes d'une même filière (consolidation)

Un même intitulé (ex. « DROIT ») existe en plusieurs `code_fil` selon la
**nature d'inscription** (segment de 3 lettres du code : `LAL` = locale/
régionale, `LAN`/`NAL` = nationale, `EAN` = école, `FCL` = formation continue…).
`extract.py` **fusionne** les variantes de même nom, même domaine et même nature
(ex. `G02LAL01/02/03` → une seule fiche), et affiche un libellé de portée
(« Inscription locale / régionale », « Inscription nationale ») pour distinguer
les natures restantes. La fusion est sans perte (aucun établissement partagé
au sein d'un groupe). Le champ `codes` liste les `code_fil` fusionnés.

### Recherche en arabe

La recherche fonctionne en **français et en arabe**. Les noms arabes des
filières sont extraits des pages « فهرس » (index) de `circulaire.pdf`
(≈ 105 / 334 filières) ; la recherche par **domaine** en arabe (طب، حقوق،
إعلام آلي…) couvre le reste. À défaut de nom arabe, l'intitulé français est
utilisé.

### Fichiers sources

Les 4 PDF sont téléchargeables depuis le pied de page (dossier `files/`).

### Limites connues

- Noms arabes des filières : couverture partielle (les pages détaillées de la
  circulaire, non indexées, ne sont pas encore exploitées) ; quelques artefacts
  de rendu arabe possibles (ex. « إعالم »). L'UI, les domaines et les séries
  sont entièrement bilingues.
- Wilaya déduite au mieux du nom de l'établissement (~1 % non attribués :
  recrutement national, centres de formation continue).
- Filières hors barème standard (médecine à recrutement national, paramédical
  `W`/`X`, certaines ENS) : libellés Min 1/2/3 génériques, sans portée.

---

## 🇩🇿 العربية

أداة للبحث عن **المعدلات الدنيا للالتحاق** بالشُّعب الجامعية الجزائرية
(بكالوريا 2023 · 2024 · 2025). تطبيق ثابت بالكامل، يعمل على GitHub Pages
وبدون اتصال بعد التحميل الأول. **تطبيق غير رسمي**، البيانات مستخرجة من وثائق
وزارة التعليم العالي.

### ماذا تعني المعدلات 1 / 2 / 3 ؟

ليست شُعباً ثابتة للبكالوريا، بل **رُتب أولوية**. الشعبة الموافقة لكل رتبة تعتمد
على **ميدان** التخصص (يُستنتج من الحرف الأول لرمز `code_fil`)، حسب الجدول الوارد
في `circulaire.pdf` (الصفحة 4)، والمُدرَج في `PRIORITY_MAP` داخل
`scripts/extract.py`.

### التشغيل محلياً

```bash
python -m http.server 8000
```

### إعادة توليد البيانات

```bash
pip install -r scripts/requirements.txt
python scripts/extract.py
```

### إضافة سنة جديدة (مثال 2026)

1. ضع الملف في `files/moy_min_bac2026.pdf` بنفس بنية الجدول.
2. أضِف `"2026"` إلى قائمة `YEARS` في أعلى `scripts/extract.py`.
3. أعد تشغيل السكربت (أو اترك إجراء GitHub يقوم بذلك تلقائياً).

### النشر على GitHub Pages

كل الملفات في الجذر ← Settings ▸ Pages ▸ فرع `main` / `/`. تحميل `data.json`
يستعمل مساراً نسبياً، لذا يعمل حتى ضمن مجلد فرعي.
