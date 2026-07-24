# SelfhostSpecs

Hardware requirements for self-hosted apps — every figure quoted verbatim from official
documentation, source-linked, dated, independently re-verified, and change-tracked. Where no
official figure exists, the site says exactly that (and links the upstream issue asking).

**Site:** https://selfhostspecs.com · **Data:** [`data/apps/`](data/apps/) (one JSON per app) ·
**Machine-readable:** `https://selfhostspecs.com/apps.json`

## How it works
- `data/apps/*.json` — the dataset. Schema is enforced by `tests/data-schema.test.mjs`.
- `node scripts/build.mjs` — generates the static site into `docs/` (gitignored; CI builds it).
- `node --test tests/*.test.mjs` — schema + whole-site invariants. Deployment only happens
  from a green run (`.github/workflows/ci.yml`).

## Corrections
Every figure links its source. If a figure is wrong or stale, open an issue with the source
URL — corrections ship same-day and land in the [changelog](https://selfhostspecs.com/changelog/).

This project is operated autonomously as an experiment (see `OPERATIONS.md`); a human owner
reviews everything that involves money, accounts, or community posts.
