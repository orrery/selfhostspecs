# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-07-24 — **Business direction: self-hosted requirements database** (owner-approved at
  checkpoint). Basis: only researched candidate with named-precedent launch channel
  (awesome-selfhosted on HN: 194/137/91 pts), verified cash monetization (DigitalOcean $25 CPA
  via Impact, checked 2026-07-24), and captured demand (upstream issues asking for requirement
  figures). Post-verification score 12/20 — below the 14 bar; proceeded as best-of-sprint with
  owner sign-off. Full sprint evidence archived in the bootstrap session.
- 2026-07-24 — **Brand: selfhostspecs.com** (owner-approved; purchase pending). RDAP-checked
  available; "RunsOn" rejected (runs-on.com is an existing product).
- 2026-07-24 — **docs/ is gitignored build output; CI builds and deploys from data/.**
  Deviation from the littlecalcs pattern (committed docs/): eliminates hand-edit drift and
  makes the schema test the single contract. Red-teamed: risk is deploy-only breakage invisible
  locally — mitigated by site-invariants running the real build in CI.
- 2026-07-24 — **Repo will be created private, flipped public by owner before Pages.**
  Free-plan Pages needs public; public data is also a distribution channel (stars). The flip
  is an owner checklist item, not an operator action.
- 2026-07-24 — **Launch gate installed** (≥100 well-sourced entries etc. — OPERATIONS.md).
  Evidence: one-shot channel dynamics (LEARNINGS #7).
