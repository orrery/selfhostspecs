// SelfhostSpecs site generator: data/apps/*.json -> docs/
// docs/ is build output — never hand-edited (OPERATIONS.md §2). Zero dependencies.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = {
  origin: "https://selfhostspecs.com",
  name: "SelfhostSpecs",
  tagline: "Hardware requirements for self-hosted apps — every figure sourced, dated, or honestly absent.",
  goatcounter: "https://selfhostspecs.goatcounter.com/count",
  repo: null, // set once the GitHub repo is public
};

export function loadApps(root = ROOT) {
  const dir = join(root, "data", "apps");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function loadChangelog(root = ROOT) {
  return JSON.parse(readFileSync(join(root, "data", "changelog.json"), "utf8"));
}

const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const fmtMb = (v) => (v >= 1024 && v % 1024 === 0 ? `${v / 1024} GB` : `${v} MB`);

function figure(app, key) {
  return app.specs?.[key] ?? null;
}
function noFigureFields(app) {
  return app.specs?.no_official_figure?.fields ?? [];
}
function cell(app, key, unit) {
  const f = figure(app, key);
  if (f) return esc(unit === "mb" ? fmtMb(f.value) : String(f.value));
  const declaredAbsent = noFigureFields(app).some((x) => x.startsWith(key));
  return declaredAbsent ? "none published" : "—";
}
function depsSummary(app) {
  const req = (app.deps ?? []).filter((d) => d.required && d.service !== "none").map((d) => d.service);
  return req.length ? req.join(", ") : "none required";
}
function armSummary(app) {
  const a = app.docker?.arches ?? [];
  if (a.includes("arm64") || a.includes("armv7")) return "yes (" + a.filter((x) => x !== "amd64").join(", ") + ")";
  return a.length ? "amd64 only" : "not yet checked";
}

// Related-apps ring: each app links the next 3 in sorted order (wrap-around), which
// guarantees every app page receives >=3 inbound links site-wide (CI-enforced >=2).
function related(apps, i) {
  return [1, 2, 3].map((k) => apps[(i + k) % apps.length]).filter((r) => r.slug !== apps[i].slug);
}

const GC_SNIPPET = `<script data-goatcounter="${SITE.goatcounter}" async src="//gc.zgo.at/count.js"></script>`;

const CSS = `
:root{--bg:#fafaf8;--fg:#1c2024;--muted:#5b6570;--line:#e3e5e2;--accent:#0b6e4f;--card:#fff;--warn:#8a6d00}
@media(prefers-color-scheme:dark){:root{--bg:#14171a;--fg:#e8eaec;--muted:#9aa4ae;--line:#2a2f34;--accent:#4cc296;--card:#1c2024;--warn:#d4b106}}
*{box-sizing:border-box}body{margin:0;font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;background:var(--bg);color:var(--fg)}
main{max-width:980px;margin:0 auto;padding:1rem 1rem 3rem}a{color:var(--accent)}
header.site h1{margin:.2rem 0;font-size:1.6rem}header.site p{margin:0 0 1rem;color:var(--muted)}
table{border-collapse:collapse;width:100%;font-size:.95rem}th,td{text-align:left;padding:.45rem .6rem;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.controls{display:flex;gap:.6rem;flex-wrap:wrap;margin:1rem 0}
.controls input[type=text],.controls select{padding:.45rem .6rem;border:1px solid var(--line);border-radius:6px;background:var(--card);color:var(--fg);font-size:.95rem}
.controls label{display:flex;align-items:center;gap:.35rem;font-size:.9rem;color:var(--muted)}
.badge{display:inline-block;font-size:.72rem;padding:.1rem .45rem;border:1px solid var(--warn);color:var(--warn);border-radius:999px;margin-left:.4rem;vertical-align:middle}
.figure{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.8rem 1rem;margin:.7rem 0}
.figure .val{font-size:1.25rem;font-weight:600}.figure blockquote{margin:.4rem 0 .2rem;padding-left:.7rem;border-left:3px solid var(--line);color:var(--muted);font-style:italic}
.figure .meta{font-size:.82rem;color:var(--muted)}
.absent{color:var(--muted)}.tablewrap{overflow-x:auto}
footer{margin-top:2.5rem;padding-top:1rem;border-top:1px solid var(--line);font-size:.85rem;color:var(--muted)}
#noresults{display:none;color:var(--muted);padding:1rem 0}
@media(max-width:640px){th.opt,td.opt{display:none}}
`;

function page({ title, desc, canonical, body, jsonld }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<main>
${body}
<footer>
<p>Every figure on this site carries its official source, a verbatim quote, and the date we read it — or says so when no official figure exists. Corrections welcome${SITE.repo ? ` via <a href="${SITE.repo}">GitHub</a>` : ""}.</p>
<p><a href="/">All apps</a> · <a href="/changelog/">Changelog</a> · <a href="/about/">About &amp; methodology</a></p>
</footer>
</main>
${GC_SNIPPET}
</body>
</html>`;
}

function indexBody(apps) {
  const cats = [...new Set(apps.map((a) => a.category))].sort();
  const rows = apps
    .map((a, i) => {
      const hasRam = figure(a, "ram_min_mb") || figure(a, "ram_rec_mb") ? "1" : "0";
      const noExt = depsSummary(a) === "none required" ? "1" : "0";
      return `<tr data-name="${esc(a.name.toLowerCase())}" data-cat="${esc(a.category)}" data-hasram="${hasRam}" data-noext="${noExt}">
<td><a href="/apps/${esc(a.slug)}/">${esc(a.name)}</a>${a.status !== "live" ? '<span class="badge">verification pending</span>' : ""}</td>
<td class="opt">${esc(a.category)}</td>
<td>${cell(a, "ram_min_mb", "mb")}</td>
<td class="opt">${cell(a, "ram_rec_mb", "mb")}</td>
<td class="opt">${cell(a, "cpu_min_cores")}</td>
<td>${esc(depsSummary(a))}</td>
<td class="opt">${esc(armSummary(a))}</td>
</tr>`;
    })
    .join("\n");
  return `<header class="site">
<h1>${esc(SITE.name)}</h1>
<p>${esc(SITE.tagline)} Currently tracking <strong>${apps.length}</strong> apps.</p>
</header>
<div class="controls">
<input type="text" id="q" placeholder="Search apps…" aria-label="Search apps">
<select id="cat" aria-label="Filter by category"><option value="">All categories</option>${cats.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
<label><input type="checkbox" id="noext"> no external services</label>
<label><input type="checkbox" id="hasram"> sourced RAM figure</label>
</div>
<div class="tablewrap"><table id="apps">
<thead><tr><th>App</th><th class="opt">Category</th><th>RAM min</th><th class="opt">RAM rec</th><th class="opt">CPU min</th><th>External services</th><th class="opt">ARM</th></tr></thead>
<tbody>
${rows}
</tbody>
</table></div>
<p id="noresults">No apps match those filters.</p>
<script>
(function(){
var q=document.getElementById("q"),cat=document.getElementById("cat"),noext=document.getElementById("noext"),hasram=document.getElementById("hasram");
var rows=Array.prototype.slice.call(document.querySelectorAll("#apps tbody tr"));
var empty=document.getElementById("noresults");
function apply(){
var t=q.value.trim().toLowerCase(),c=cat.value,n=0;
rows.forEach(function(r){
var ok=(!t||r.dataset.name.indexOf(t)>=0)&&(!c||r.dataset.cat===c)&&(!noext.checked||r.dataset.noext==="1")&&(!hasram.checked||r.dataset.hasram==="1");
r.style.display=ok?"":"none";if(ok)n++;});
empty.style.display=n?"none":"block";}
[q,cat,noext,hasram].forEach(function(el){el.addEventListener("input",apply);el.addEventListener("change",apply);});
})();
</script>`;
}

function figureBlock(label, f) {
  return `<div class="figure"><div>${esc(label)}</div><div class="val">${esc(f.display)}</div><blockquote>“${esc(f.quote)}”</blockquote><div class="meta">Scope: ${esc(
    f.scope
  )} · <a href="${esc(f.source_url)}">official source</a> · retrieved ${esc(f.retrieved)}</div></div>`;
}

function appBody(apps, i) {
  const a = apps[i];
  const figs = [];
  const defs = [
    ["Minimum RAM", "ram_min_mb", "mb"],
    ["Recommended RAM", "ram_rec_mb", "mb"],
    ["Minimum CPU cores", "cpu_min_cores", "n"],
    ["Recommended CPU cores", "cpu_rec_cores", "n"],
  ];
  for (const [label, key, unit] of defs) {
    const f = figure(a, key);
    if (f) figs.push(figureBlock(label, { ...f, display: unit === "mb" ? fmtMb(f.value) : `${f.value} cores` }));
  }
  const absent = noFigureFields(a);
  const absentHtml = absent.length
    ? `<div class="figure"><div>No official figure published for: <strong>${absent.map(esc).join(", ")}</strong></div><div class="meta absent">We publish nothing we can't source. Evidence of the gap: <a href="${esc(
        a.specs.no_official_figure.evidence_url
      )}">upstream discussion</a>.</div></div>`
    : "";
  const deps = (a.deps ?? [])
    .map((d) =>
      d.service === "none"
        ? `<li>No required external services (<a href="${esc(d.source_url)}">source</a>)</li>`
        : `<li>${esc(d.service)}${d.required ? " (required)" : " (optional)"} — <a href="${esc(d.source_url)}">source</a></li>`
    )
    .join("");
  const dockerSize = a.docker?.size_mb ? fmtMb(a.docker.size_mb) : "not yet checked";
  const rel = related(apps, i)
    .map((r) => `<li><a href="/apps/${esc(r.slug)}/">${esc(r.name)}</a> — ${esc(r.description)}</li>`)
    .join("");
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p>
<h1>${esc(a.name)} — system requirements${a.status !== "live" ? '<span class="badge">verification pending</span>' : ""}</h1>
<p>${esc(a.description)} · <a href="${esc(a.website)}">website</a> · <a href="${esc(a.repo)}">repository</a></p>
</header>
${figs.join("\n")}
${absentHtml}
<h2>External services</h2><ul>${deps}</ul>
<h2>Container</h2><p>Image: <code>${esc(a.docker?.image ?? "not yet checked")}</code> · size: ${esc(dockerSize)} · architectures: ${esc(armSummary(a))}</p>
<h2>Related apps</h2><ul>${rel}</ul>`;
}

function aboutBody(apps) {
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p><h1>About &amp; methodology</h1></header>
<p>${esc(SITE.name)} answers one question: <em>what does a self-hosted app actually need to run?</em> —
with figures that can be trusted because each one is quoted verbatim from the project's own
documentation, linked, dated, and re-checked on a schedule.</p>
<ul>
<li><strong>Source-or-silence:</strong> if a project publishes no official figure, we say exactly that and link the upstream discussion asking for one. We never estimate.</li>
<li><strong>Minimum ≠ recommended:</strong> we never promote one into the other.</li>
<li><strong>Scoped:</strong> a figure valid for one install path is labeled with that path.</li>
<li><strong>Independently verified:</strong> a second reviewer re-fetches every source before an entry loses its "verification pending" badge.</li>
<li><strong>Change-tracked:</strong> when upstream requirements change, the <a href="/changelog/">changelog</a> records what changed and when.</li>
</ul>
<p>Currently tracking ${apps.length} apps. This is a young dataset growing continuously.</p>`;
}

function changelogBody(entries) {
  const items = entries.length
    ? entries
        .map(
          (e) =>
            `<li><strong>${esc(e.date)}</strong> — ${esc(e.app)}: ${esc(e.change)} (<a href="${esc(e.source_url)}">source</a>)</li>`
        )
        .join("")
    : "<li>No upstream requirement changes recorded yet — the dataset is new. Entries appear here the day a source changes.</li>";
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p><h1>Changelog — upstream requirement changes</h1></header><ul>${items}</ul>`;
}

export function build(root = ROOT) {
  const apps = loadApps(root);
  const changelog = loadChangelog(root);
  const out = join(root, "docs");
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const urls = [];
  const emit = (rel, html) => {
    const dir = join(out, rel);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    urls.push(`${SITE.origin}/${rel ? rel + "/" : ""}`.replace(/\/\/$/, "/"));
  };

  emit(
    "",
    page({
      title: `${SITE.name} — hardware requirements for self-hosted apps`,
      desc: SITE.tagline,
      canonical: `${SITE.origin}/`,
      body: indexBody(apps),
      jsonld: {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: `${SITE.name} self-hosted app requirements dataset`,
        description: SITE.tagline,
        url: `${SITE.origin}/`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", name: SITE.name },
      },
    })
  );

  apps.forEach((a, i) =>
    emit(
      `apps/${a.slug}`,
      page({
        title: `${a.name} system requirements — RAM, CPU, dependencies | ${SITE.name}`,
        desc: `What ${a.name} needs to run: sourced RAM/CPU figures, required services, container size and ARM support.`,
        canonical: `${SITE.origin}/apps/${a.slug}/`,
        body: appBody(apps, i),
        jsonld: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: SITE.name, item: `${SITE.origin}/` },
            { "@type": "ListItem", position: 2, name: a.name, item: `${SITE.origin}/apps/${a.slug}/` },
          ],
        },
      })
    )
  );

  emit(
    "about",
    page({
      title: `About & methodology | ${SITE.name}`,
      desc: "How SelfhostSpecs sources, verifies, and change-tracks every figure.",
      canonical: `${SITE.origin}/about/`,
      body: aboutBody(apps),
      jsonld: { "@context": "https://schema.org", "@type": "AboutPage", url: `${SITE.origin}/about/` },
    })
  );

  emit(
    "changelog",
    page({
      title: `Changelog — upstream requirement changes | ${SITE.name}`,
      desc: "Dated record of every upstream hardware-requirement change we detect.",
      canonical: `${SITE.origin}/changelog/`,
      body: changelogBody(changelog),
      jsonld: { "@context": "https://schema.org", "@type": "WebPage", url: `${SITE.origin}/changelog/` },
    })
  );

  writeFileSync(join(out, "apps.json"), JSON.stringify({ generated_from: "data/apps", count: apps.length, apps }, null, 2));
  writeFileSync(
    join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `<url><loc>${u}</loc></url>`)
      .join("\n")}\n</urlset>\n`
  );
  writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`);
  writeFileSync(join(out, "CNAME"), "selfhostspecs.com\n");
  writeFileSync(join(out, ".nojekyll"), "");
  return { apps: apps.length, pages: urls.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = build();
  console.log(`Built ${r.pages} pages from ${r.apps} app entries into docs/`);
}
