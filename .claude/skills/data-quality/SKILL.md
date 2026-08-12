---
name: data-quality
description: The SelfhostSpecs product-quality standard — data schema discipline, sourcing rules, page conventions, and the defect-class checklist. Use for every BUILD batch, every data correction, and as the bar QA judges against.
---

# SelfhostSpecs data & page quality standard

The product is trust. A wrong number in a requirements table is worse than no number: someone
provisions a server on our say-so. Everything below serves "every figure sourced, dated,
verified — or honestly absent."

## The entry schema (contract: tests/data-schema.test.mjs)
`data/apps/<slug>.json`, one app per file, slug = filename:
- `name`, `slug`, `category`, `website`, `repo` (https), `description` (one plain sentence,
  no marketing), `status`: `pending-verification` | `pending-qa` | `pending-second-qa` | `live`.
- `specs.ram_min_mb` / `specs.ram_rec_mb` / `specs.cpu_min_cores` / `specs.cpu_rec_cores`:
  either absent or `{ "value": int, "source_url", "quote", "retrieved": "YYYY-MM-DD", "scope" }`.
  `quote` is VERBATIM from the source (verifier checks literal presence). `scope` states the
  install path the figure applies to ("Docker, general", "Home Assistant OS on Raspberry Pi").
- `specs.no_official_figure`: `{ "fields": [...], "evidence_url" }` — required when RAM/CPU
  figures are absent; point at the upstream issue asking for them if one exists.
- `deps`: array of `{ "service": "postgresql|mysql|mariadb|redis|valkey|mongodb|elasticsearch|clickhouse|rabbitmq|memcached|meilisearch|ffmpeg|ferretdb|pict-rs|soketi|mqtt|none", "required": bool, "source_url" }`.
  Enum-extension policy (LEARNINGS #45/46, resolved 2026-08-12): add a slot only when a
  currently-queued candidate's official compose/docs cites it as a distinct required or
  optional container — the project's own bespoke name for a one-off component (`ferretdb`,
  `pict-rs`, `soketi`), the generic protocol name when the candidate needs "any X broker"
  (`mqtt`, not a specific implementation). Don't add slots speculatively for held/refuted
  candidates (Sentry/PostHog's kafka/zookeeper/opensearch/temporal stay unmapped — Effort-refuted,
  not queued).
- `docker`: `{ "image", "size_mb": int|null, "arches": ["amd64","arm64","armv7"], "source_url", "retrieved" }`.
- `sources_of_truth`: list of official URLs the freshness sweep re-checks.

**Image-size convention:** `docker.size_mb` is the COMPRESSED amd64 image size in MB —
Docker Hub API `images[].size` for the amd64 entry, or the sum of OCI layer sizes from a
registry manifest. Pages label it "compressed size (amd64)"; never present it as
installed/uncompressed size. Multi-arch sizes differ; we index amd64 and say so.

## Sourcing rules
1. Official only: the project's own docs, README, compose files, image manifests. Third-party
   blogs are never sources for figures (they may be FIND leads, nothing more).
2. Minimum ≠ recommended: never promote either into the other. "At least 8GB is recommended"
   is a RECOMMENDED figure and leaves minimum absent.
3. Units: store megabytes as integers with one fixed convention — "1 GB" in a source is
   recorded as 1024 MB (and "512 MB" as 512), applied identically everywhere so sorting and
   filtering are consistent. The verbatim quote is always displayed beside the number, so the
   reader sees the source's original wording; the quote is the ground truth, our integer is
   the index. Never mix conventions between entries.
4. A dead or changed source is a same-day changelog entry, never a silent edit.

## Page conventions (build emits these; QA judges them)
- Every page: canonical URL, viewport meta, GoatCounter snippet, plain honest tone, dark-mode
  support, no layout shift on filter, mobile-first table (non-essential columns hide under
  640px; what remains must be sufficient and honest on a 320px screen).
- Per-app page: the figures WITH their quotes and dates visible, "no official figure" stated
  plainly with the evidence linked, related apps ring-linked (deterministic ring guarantees
  every app page ≥2 inbound links; category affinity is a nice-to-have, not the mechanism).
- Index: client-side filter/sort over embedded JSON; zero-result states say so honestly;
  counts always computed from data, never hardcoded.
- Claims discipline: nothing on any page may overstate coverage or freshness ("re-verified
  monthly" may only appear once a monthly sweep demonstrably runs).
- Affiliate links (when owner enables): disclosed inline, at hosting-decision moments only.
- No dark patterns, no fake urgency, no "as seen on" until literally true.

## Known Defect Classes
Address ALL of OPERATIONS.md's Known Defect Classes list in every batch; QA hunts them
specifically. New defect found anywhere → append it there the same day.

## QA brief (for the independent agent)
Sample ≥3 figures per batch: open the source, confirm verbatim quote, value, units, scope,
min/rec assignment. Try to break the site: zero-result filters, URL tampering, 320px viewport,
non-Chromium engine, JS disabled (table must still render server-side rows). Audit every claim
sentence on changed pages for literal truth. Report defects by class; anything novel becomes a
new class.
