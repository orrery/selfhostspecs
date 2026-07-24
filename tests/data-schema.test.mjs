// Schema contract for data/apps/*.json — the data layer's load-bearing gate.
// A figure without source_url + verbatim quote + retrieved date must not exist (OPERATIONS.md rule 8).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "data", "apps");
const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));

const STATUSES = ["pending-verification", "pending-qa", "pending-second-qa", "live"];
const SERVICES = ["postgresql", "mysql", "mariadb", "redis", "valkey", "mongodb", "elasticsearch", "clickhouse", "rabbitmq", "ffmpeg", "none"];
const ARCHES = ["amd64", "arm64", "armv7"];
const FIGURE_KEYS = ["ram_min_mb", "ram_rec_mb", "cpu_min_cores", "cpu_rec_cores"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const HTTPS = /^https:\/\//;

function assertFigure(f, name, file) {
  assert.equal(typeof f.value, "number", `${file}: ${name}.value must be a number`);
  assert.ok(Number.isInteger(f.value) && f.value > 0, `${file}: ${name}.value must be a positive integer`);
  assert.match(f.source_url ?? "", HTTPS, `${file}: ${name}.source_url must be https`);
  assert.ok(typeof f.quote === "string" && f.quote.trim().length >= 5, `${file}: ${name}.quote must be a real verbatim quote`);
  assert.match(f.retrieved ?? "", ISO, `${file}: ${name}.retrieved must be YYYY-MM-DD`);
  assert.ok(f.retrieved <= new Date().toISOString().slice(0, 10), `${file}: ${name}.retrieved must not be in the future`);
  assert.ok(typeof f.scope === "string" && f.scope.trim().length >= 3, `${file}: ${name}.scope must state the install path`);
}

test("at least one app entry exists", () => {
  assert.ok(files.length > 0, "data/apps is empty");
});

for (const file of files) {
  test(`schema: ${file}`, () => {
    const a = JSON.parse(readFileSync(join(DIR, file), "utf8"));
    assert.equal(a.slug, basename(file, ".json"), `${file}: slug must equal filename`);
    for (const k of ["name", "category", "description"]) {
      assert.ok(typeof a[k] === "string" && a[k].trim().length > 0, `${file}: ${k} required`);
    }
    assert.match(a.website ?? "", HTTPS, `${file}: website must be https`);
    assert.match(a.repo ?? "", HTTPS, `${file}: repo must be https`);
    assert.ok(STATUSES.includes(a.status), `${file}: status must be one of ${STATUSES.join("/")}`);
    assert.ok(a.description.length <= 140, `${file}: description is one plain sentence (<=140 chars)`);

    // specs: only known keys; every figure fully sourced
    const specKeys = Object.keys(a.specs ?? {});
    for (const k of specKeys) {
      assert.ok([...FIGURE_KEYS, "no_official_figure"].includes(k), `${file}: unknown specs key ${k}`);
    }
    let figureCount = 0;
    for (const k of FIGURE_KEYS) {
      if (a.specs?.[k]) {
        assertFigure(a.specs[k], `specs.${k}`, file);
        figureCount++;
      }
    }
    // zero-vs-absent honesty: no RAM figure at all => must declare no_official_figure
    const hasRam = Boolean(a.specs?.ram_min_mb || a.specs?.ram_rec_mb);
    if (!hasRam) {
      assert.ok(a.specs?.no_official_figure, `${file}: no RAM figure and no no_official_figure declaration — absence must be explicit`);
    }
    if (a.specs?.no_official_figure) {
      const n = a.specs.no_official_figure;
      assert.ok(Array.isArray(n.fields) && n.fields.length > 0, `${file}: no_official_figure.fields required`);
      assert.match(n.evidence_url ?? "", HTTPS, `${file}: no_official_figure.evidence_url must be https`);
      for (const declared of n.fields) {
        const base = declared.split(" ")[0];
        assert.ok(!a.specs[base], `${file}: ${base} declared absent but a figure exists — contradiction`);
      }
    }
    // min/rec sanity: recommended >= minimum when both present
    if (a.specs?.ram_min_mb && a.specs?.ram_rec_mb) {
      assert.ok(a.specs.ram_rec_mb.value >= a.specs.ram_min_mb.value, `${file}: recommended RAM below minimum`);
    }
    if (a.specs?.cpu_min_cores && a.specs?.cpu_rec_cores) {
      assert.ok(a.specs.cpu_rec_cores.value >= a.specs.cpu_min_cores.value, `${file}: recommended cores below minimum`);
    }

    // deps
    assert.ok(Array.isArray(a.deps) && a.deps.length > 0, `${file}: deps array required (use service:"none" if none)`);
    for (const d of a.deps) {
      assert.ok(SERVICES.includes(d.service), `${file}: unknown dep service ${d.service}`);
      assert.equal(typeof d.required, "boolean", `${file}: dep.required must be boolean`);
      assert.match(d.source_url ?? "", HTTPS, `${file}: dep.source_url must be https`);
    }

    // docker
    assert.ok(a.docker && typeof a.docker.image === "string" && a.docker.image.length > 0, `${file}: docker.image required`);
    assert.ok(a.docker.size_mb === null || (Number.isInteger(a.docker.size_mb) && a.docker.size_mb > 0), `${file}: docker.size_mb must be null or positive int`);
    assert.ok(Array.isArray(a.docker.arches) && a.docker.arches.every((x) => ARCHES.includes(x)), `${file}: docker.arches must be subset of ${ARCHES.join("/")}`);
    assert.ok(a.docker.retrieved === null || ISO.test(a.docker.retrieved), `${file}: docker.retrieved must be null or YYYY-MM-DD`);

    // sources of truth
    assert.ok(Array.isArray(a.sources_of_truth) && a.sources_of_truth.length > 0, `${file}: sources_of_truth required`);
    for (const s of a.sources_of_truth) assert.match(s, HTTPS, `${file}: sources_of_truth must be https`);
  });
}

test("app names are unique", () => {
  const names = files.map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")).name.toLowerCase());
  assert.equal(new Set(names).size, names.length, "duplicate app names");
});

test("changelog is a valid array of sourced entries", () => {
  const log = JSON.parse(readFileSync(join(ROOT, "data", "changelog.json"), "utf8"));
  assert.ok(Array.isArray(log));
  for (const e of log) {
    assert.match(e.date ?? "", ISO);
    assert.ok(typeof e.app === "string" && e.app.length > 0);
    assert.ok(typeof e.change === "string" && e.change.length > 5);
    assert.match(e.source_url ?? "", HTTPS);
  }
});
