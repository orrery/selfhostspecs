// Whole-site invariants over the build output. Runs the real build, then inspects docs/.
// Deployment is gated on this file passing in CI — these are the promises every page keeps.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build, loadApps, noExternalServices } from "../scripts/build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
let apps;

before(() => {
  build(ROOT);
  apps = loadApps(ROOT);
});

function htmlFiles(dir = DOCS, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) htmlFiles(p, acc);
    else if (f.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const BANNED = [
  "undefined", "NaN", "[object Object]",
  "guaranteed", "100% accurate", "always up to date", "blazing",
  'type="month"', 'type="week"', "!important-urgency",
];

test("every page carries analytics, canonical, viewport, and no banned patterns", () => {
  const pages = htmlFiles();
  assert.ok(pages.length >= apps.length + 3, "expected index + per-app + about + changelog pages");
  for (const p of pages) {
    const html = readFileSync(p, "utf8");
    assert.ok(html.includes("goatcounter"), `${p}: missing analytics snippet`);
    assert.ok(html.includes('rel="canonical"'), `${p}: missing canonical`);
    assert.ok(html.includes('name="viewport"'), `${p}: missing viewport`);
    assert.ok(html.includes('rel="icon"'), `${p}: missing favicon link (every browser auto-requests /favicon.ico and 404s without one)`);
    assert.ok(existsSync(join(DOCS, "favicon.ico")), `${p}: docs/favicon.ico must exist as a real file — a <link rel="icon"> tag alone does not stop browsers' separate automatic GET /favicon.ico request from 404ing (AUDIT #3 finding: this was believed fixed but wasn't)`);
    assert.ok(html.match(/<html lang="en">/), `${p}: missing lang`);
    for (const b of BANNED) {
      assert.ok(!html.includes(b), `${p}: banned pattern present: ${b}`);
    }
    // canonical must point at our origin
    const canon = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.ok(canon.startsWith("https://selfhostspecs.com/"), `${p}: canonical off-origin: ${canon}`);
  }
});

test("JSON-LD on every page parses", () => {
  for (const p of htmlFiles()) {
    const html = readFileSync(p, "utf8");
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(m, `${p}: missing JSON-LD`);
    const parsed = JSON.parse(m[1]);
    assert.ok(parsed["@context"], `${p}: JSON-LD missing @context`);
  }
});

test("every app has a page showing its verbatim quotes and honest absences", () => {
  for (const a of apps) {
    const p = join(DOCS, "apps", a.slug, "index.html");
    assert.ok(existsSync(p), `missing page for ${a.slug}`);
    const html = readFileSync(p, "utf8");
    for (const key of ["ram_min_mb", "ram_rec_mb", "cpu_min_cores", "cpu_rec_cores"]) {
      const f = a.specs?.[key];
      if (f) {
        // quote must be displayed (HTML-escaped compare on a distinctive fragment)
        const frag = f.quote.slice(0, 30).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        assert.ok(html.includes(frag), `${a.slug}: quote for ${key} not displayed`);
        assert.ok(html.includes(f.source_url), `${a.slug}: source link for ${key} missing`);
        assert.ok(html.includes(f.retrieved), `${a.slug}: retrieved date for ${key} missing`);
      }
    }
    if (a.specs?.no_official_figure) {
      assert.ok(html.includes("No official figure published"), `${a.slug}: absent figures not honestly declared`);
      assert.ok(html.includes(a.specs.no_official_figure.evidence_url), `${a.slug}: absence evidence link missing`);
    }
    if (a.docker?.note) {
      const frag = a.docker.note.slice(0, 30).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
      assert.ok(html.includes(frag), `${a.slug}: docker.note not rendered on page (Defect Class #15 — representative-image ambiguity must be disclosed)`);
    }
    for (const d of a.deps ?? []) {
      if (d.note) {
        const frag = d.note.slice(0, 30).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        assert.ok(html.includes(frag), `${a.slug}: deps[].note for "${d.service}" not rendered on page (same silent-drop risk as Defect Class #15, for dependency disclosures instead of image disclosures)`);
      }
    }
  }
});

test("internal links resolve and every app page has >=2 inbound links", () => {
  const pages = htmlFiles();
  const inbound = new Map(apps.map((a) => [`/apps/${a.slug}/`, new Set()]));
  for (const p of pages) {
    const html = readFileSync(p, "utf8");
    for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
      const target = join(DOCS, href.replace(/\/$/, ""), "index.html");
      assert.ok(existsSync(target), `${p}: dead internal link ${href}`);
      if (inbound.has(href) && !p.includes(join("apps", href.split("/")[2] ?? "~"))) {
        inbound.get(href).add(p);
      }
    }
  }
  for (const [url, sources] of inbound) {
    assert.ok(sources.size >= 2, `${url}: only ${sources.size} inbound links — orphan risk`);
  }
});

test("sitemap covers exactly the generated pages; robots and CNAME correct", () => {
  const sitemap = readFileSync(join(DOCS, "sitemap.xml"), "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, htmlFiles().length, "sitemap count != page count");
  for (const a of apps) {
    assert.ok(locs.includes(`https://selfhostspecs.com/apps/${a.slug}/`), `sitemap missing ${a.slug}`);
  }
  assert.ok(readFileSync(join(DOCS, "robots.txt"), "utf8").includes("Sitemap: https://selfhostspecs.com/sitemap.xml"));
  assert.equal(readFileSync(join(DOCS, "CNAME"), "utf8").trim(), "selfhostspecs.com");
});

test("apps.json matches the data layer", () => {
  const j = JSON.parse(readFileSync(join(DOCS, "apps.json"), "utf8"));
  assert.equal(j.count, apps.length);
  assert.deepEqual(j.apps.map((a) => a.slug).sort(), apps.map((a) => a.slug).sort());
});

test("index counts are computed from data, not hardcoded", () => {
  const html = readFileSync(join(DOCS, "index.html"), "utf8");
  assert.ok(html.includes(`<strong>${apps.length}</strong>`), "app count on index != data count");
  const rows = (html.match(/<tr data-name=/g) ?? []).length;
  assert.equal(rows, apps.length, "table rows != app count");
});

test("collection page membership exactly matches the data-derived predicate", () => {
  const p = join(DOCS, "collections", "no-external-database", "index.html");
  assert.ok(existsSync(p), "collection page missing");
  const html = readFileSync(p, "utf8");
  const members = apps.filter(noExternalServices);
  const nonMembers = apps.filter((a) => !noExternalServices(a));
  const tableRegion = html.slice(html.indexOf("<tbody>"), html.indexOf("</tbody>"));
  for (const a of members) {
    assert.ok(tableRegion.includes(`/apps/${a.slug}/`), `collection missing member ${a.slug}`);
  }
  for (const a of nonMembers) {
    assert.ok(!tableRegion.includes(`/apps/${a.slug}/`), `collection wrongly lists ${a.slug}`);
  }
  assert.ok(
    html.includes(`<strong>${members.length}</strong> of ${apps.length}`),
    "collection count not computed from data"
  );
});

test("scoped figures carry visible markers in tables; legend present", () => {
  const index = readFileSync(join(DOCS, "index.html"), "utf8");
  const collection = readFileSync(join(DOCS, "collections", "no-external-database", "index.html"), "utf8");
  // every non-general figure rendered in a table cell must carry the scopemark with its scope as title
  for (const a of apps) {
    for (const key of ["ram_min_mb", "ram_rec_mb"]) {
      const f = a.specs?.[key];
      if (f && f.general !== true) {
        assert.ok(
          index.includes(`title="${f.scope.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}"`),
          `index: ${a.slug} ${key} scoped figure missing scopemark/title`
        );
      }
    }
  }
  assert.ok(index.includes("scopemark"), "index missing scopemarks entirely");
  assert.ok(index.includes("scoped figure — hover"), "index missing scope legend");
  assert.ok(collection.includes("Figures marked *"), "collection missing scope legend");
});

test("unverified entries visibly carry the verification-pending badge", () => {
  for (const a of apps.filter((x) => x.status !== "live")) {
    const html = readFileSync(join(DOCS, "apps", a.slug, "index.html"), "utf8");
    assert.ok(html.includes("verification pending"), `${a.slug}: unverified entry shown without badge`);
  }
});
