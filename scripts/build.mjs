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
  if (f) {
    const v = esc(unit === "mb" ? fmtMb(f.value) : String(f.value));
    // Scoped figures get a visible marker in sortable tables — a per-process or
    // Pi-only number presented bare would mislead (defect class 3). Whether a figure
    // is safe to show bare is an explicit data decision (`general: true`), never a
    // heuristic over the scope prose — "Per process, general installation" broke that.
    return f.general === true ? v : `${v}<span class="scopemark" title="${esc(f.scope)}">*</span>`;
  }
  return noFigureFields(app).includes(key) ? "none published" : "—";
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
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2216%22 fill=%22%23111827%22/><text x=%2250%22 y=%2268%22 font-size=%2264%22 font-family=%22monospace%22 fill=%22%2322d3ee%22 text-anchor=%22middle%22>S</text></svg>">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<main>
${body}
<footer>
<p>Every figure on this site carries its official source, a verbatim quote or precise locator, and the date we read it — or says so when no official figure exists. Corrections welcome${SITE.repo ? ` via <a href="${SITE.repo}">GitHub</a>` : ""}.</p>
<p><a href="/">All apps</a> · <a href="/collections/no-external-database/">No external database</a> · <a href="/changelog/">Changelog</a> · <a href="/about/">About &amp; methodology</a></p>
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
      return `<tr data-name="${esc(a.name.toLowerCase().replace(/[^a-z0-9]/g, ""))}" data-cat="${esc(a.category)}" data-hasram="${hasRam}" data-noext="${noExt}">
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
<p class="absent" style="font-size:.82rem">* scoped figure — hover for the qualifier, or see the app's page (e.g. per-process or platform-specific numbers).</p>
<script>
(function(){
var q=document.getElementById("q"),cat=document.getElementById("cat"),noext=document.getElementById("noext"),hasram=document.getElementById("hasram");
var rows=Array.prototype.slice.call(document.querySelectorAll("#apps tbody tr"));
var empty=document.getElementById("noresults");
function apply(){
var t=q.value.trim().toLowerCase().replace(/[^a-z0-9]/g,""),c=cat.value,n=0;
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
    if (f) figs.push(figureBlock(label, { ...f, display: unit === "mb" ? fmtMb(f.value) : `${f.value} ${f.value === 1 ? "core" : "cores"}` }));
  }
  const FRIENDLY = {
    ram_min_mb: "minimum RAM",
    ram_rec_mb: "recommended RAM",
    cpu_min_cores: "minimum CPU cores",
    cpu_rec_cores: "recommended CPU cores",
  };
  const absent = noFigureFields(a);
  const absentNote = a.specs?.no_official_figure?.note;
  const absentHtml = absent.length
    ? `<div class="figure"><div>No official figure published for: <strong>${absent.map((k) => esc(FRIENDLY[k] ?? k)).join(", ")}</strong></div>${
        absentNote ? `<div class="meta">${esc(absentNote)}</div>` : ""
      }<div class="meta absent">We publish nothing we can't source. <a href="${esc(
        a.specs.no_official_figure.evidence_url
      )}">Evidence of the gap</a>.</div></div>`
    : "";
  const deps = (a.deps ?? [])
    .map((d) =>
      d.service === "none"
        ? `<li>No required external services (<a href="${esc(d.source_url)}">source</a>)</li>`
        : `<li>${esc(d.service)}${d.required ? " (required)" : " (optional)"} — <a href="${esc(d.source_url)}">source</a></li>`
    )
    .join("");
  const depNotes = [...new Set((a.deps ?? []).map((d) => d.note).filter(Boolean))]
    .map((n) => `<p class="meta">${esc(n)}</p>`)
    .join("");
  const dockerSize = a.docker?.size_mb ? fmtMb(a.docker.size_mb) : "not yet checked";
  const dockerNote = a.docker?.note ? `<p class="meta">${esc(a.docker.note)}</p>` : "";
  const rel = related(apps, i)
    .map((r) => `<li><a href="/apps/${esc(r.slug)}/">${esc(r.name)}</a> — ${esc(r.description)}</li>`)
    .join("");
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p>
<h1>${esc(a.name)} — system requirements${a.status !== "live" ? '<span class="badge">verification pending</span>' : ""}</h1>
<p>${esc(a.description)} · <a href="${esc(a.website)}">website</a> · <a href="${esc(a.repo)}">repository</a></p>
</header>
${figs.join("\n")}
${absentHtml}
<h2>External services</h2><ul>${deps}</ul>${depNotes}
<h2>Container</h2><p>Image: <code>${esc(a.docker?.image ?? "not yet checked")}</code> · compressed size (amd64): ${esc(dockerSize)} · architectures: ${esc((a.docker?.arches ?? []).length ? a.docker.arches.join(", ") : "not yet checked")}${a.docker?.retrieved ? ` · <a href="${esc(a.docker.source_url)}">source</a>, retrieved ${esc(a.docker.retrieved)}` : ""}</p>${dockerNote}
<h2>Related apps</h2><ul>${rel}</ul>`;
}

// Collection membership predicates — derived from data, never hand-curated lists.
export function noExternalServices(app) {
  return !(app.deps ?? []).some((d) => d.required && d.service !== "none");
}

function collectionNoExtDbBody(apps) {
  const members = apps.filter(noExternalServices);
  const rows = members
    .map(
      (a) => `<tr><td><a href="/apps/${esc(a.slug)}/">${esc(a.name)}</a></td><td>${esc(a.category)}</td><td>${cell(
        a,
        "ram_min_mb",
        "mb"
      )}</td><td>${a.docker?.size_mb ? esc(fmtMb(a.docker.size_mb)) : "not yet checked"}</td></tr>`
    )
    .join("\n");
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p>
<h1>Self-hosted apps without an external database</h1>
<p>Every app below needs no separate database or cache container for you to run and maintain
yourself — any such service is either not required at all, or bundled inside the app's own
container image (check the app's page for which). Membership is derived automatically from
each app's sourced dependency data, so this list updates itself as the dataset grows.
Currently <strong>${members.length}</strong> of ${apps.length} tracked apps qualify.</p>
</header>
<div class="tablewrap"><table>
<thead><tr><th>App</th><th>Category</th><th>RAM min</th><th>Image size</th></tr></thead>
<tbody>
${rows}
</tbody>
</table></div>
<p>Figures follow the same rules as everywhere on ${esc(SITE.name)}: quoted verbatim from
official docs with source and date, or honestly absent. Image sizes are compressed amd64.
Figures marked * are scoped (per-process or platform-specific) — see the app's page.</p>`;
}

function aboutBody(apps) {
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p><h1>About &amp; methodology</h1></header>
<p>${esc(SITE.name)} answers one question: <em>what does a self-hosted app actually need to run?</em> —
with figures that can be trusted because each one is quoted verbatim from the project's own
documentation, linked, dated, and independently re-fetched before publication.</p>
<ul>
<li><strong>Source-or-silence:</strong> if a project publishes no official figure, we say exactly that and link the upstream discussion asking for one. We never estimate.</li>
<li><strong>Minimum ≠ recommended:</strong> we never promote one into the other.</li>
<li><strong>Scoped:</strong> a figure valid for one install path is labeled with that path.</li>
<li><strong>Independently verified:</strong> a second reviewer re-fetches every source before an entry loses its "verification pending" badge.</li>
<li><strong>Change-tracked:</strong> the <a href="/changelog/">changelog</a> records every change to published data — our own corrections included — and upstream requirement changes as we detect them.</li>
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
  return `<header class="site"><p><a href="/">← ${esc(SITE.name)}</a></p><h1>Changelog — data corrections &amp; upstream changes</h1><p>Every change to published data, dated and sourced: our own corrections included, and upstream requirement changes as we detect them. No silent edits.</p></header><ul>${items}</ul>`;
}

// Minimal 16x16 32bpp ICO matching the inline SVG favicon's brand colors.
// Browsers request /favicon.ico directly regardless of a <link rel="icon"> tag,
// so the data-URI SVG alone does not stop that request from 404ing (AUDIT #3 finding).
function buildFaviconIco() {
  const W = 16,
    H = 16;
  const bg = [0x11, 0x18, 0x27]; // #111827
  const accent = [0x22, 0xd3, 0xee]; // #22d3ee
  const pixels = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const inAccent = x >= 6 && x <= 9 && y >= 3 && y <= 12;
      const [r, g, b] = inAccent ? accent : bg;
      // bottom-up rows, BGRA
      const row = H - 1 - y;
      const off = (row * W + x) * 4;
      pixels[off] = b;
      pixels[off + 1] = g;
      pixels[off + 2] = r;
      pixels[off + 3] = 0xff;
    }
  }
  const andMaskRowBytes = Math.ceil(W / 8 / 4) * 4;
  const andMask = Buffer.alloc(andMaskRowBytes * H, 0);

  const dib = Buffer.alloc(40);
  dib.writeUInt32LE(40, 0); // biSize
  dib.writeInt32LE(W, 4); // biWidth
  dib.writeInt32LE(H * 2, 8); // biHeight (doubled for AND mask)
  dib.writeUInt16LE(1, 12); // biPlanes
  dib.writeUInt16LE(32, 14); // biBitCount
  dib.writeUInt32LE(0, 16); // biCompression
  dib.writeUInt32LE(pixels.length, 20); // biSizeImage

  const image = Buffer.concat([dib, pixels, andMask]);

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(1, 4); // count = 1

  const entry = Buffer.alloc(16);
  entry.writeUInt8(W, 0);
  entry.writeUInt8(H, 1);
  entry.writeUInt8(0, 2); // colorCount
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bitCount
  entry.writeUInt32LE(image.length, 8); // bytesInRes
  entry.writeUInt32LE(22, 12); // imageOffset (6 + 16)

  return Buffer.concat([header, entry, image]);
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
    "collections/no-external-database",
    page({
      title: `Self-hosted apps without an external database | ${SITE.name}`,
      desc: "Self-hosted apps with no required Postgres/Redis/external services — derived from sourced dependency data.",
      canonical: `${SITE.origin}/collections/no-external-database/`,
      body: collectionNoExtDbBody(apps),
      jsonld: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Self-hosted apps without an external database",
        url: `${SITE.origin}/collections/no-external-database/`,
      },
    })
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
      title: `Changelog — data corrections & upstream changes | ${SITE.name}`,
      desc: "Dated, sourced record of every change to published data — corrections and upstream requirement changes alike.",
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
  writeFileSync(join(out, "favicon.ico"), buildFaviconIco());
  writeFileSync(join(out, "CNAME"), "selfhostspecs.com\n");
  writeFileSync(join(out, ".nojekyll"), "");
  return { apps: apps.length, pages: urls.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = build();
  console.log(`Built ${r.pages} pages from ${r.apps} app entries into docs/`);
}
