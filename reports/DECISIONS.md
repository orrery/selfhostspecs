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
- 2026-07-24 — **Repo made PUBLIC (owner call, trade-off surfaced).** Owner has GitHub Pro so
  private+Pages was available; owner chose public anyway after hearing both sides (open
  data/stars/corrections channel vs. visible playbook). Pages had already been enabled +
  custom domain set via API. Operator flipped visibility via API on owner instruction.
- 2026-07-24 — **Launch gate installed** (≥100 well-sourced entries etc. — OPERATIONS.md).
  Evidence: one-shot channel dynamics (LEARNINGS #7).
- 2026-07-24 — **First full cycle shipped: 14 apps live at selfhostspecs.com** through the
  complete gate (harvest → independent verification → CI → independent QA BLOCK → fixes →
  re-QA → deterministic test pins → deploy green). QA refuted/blocked once (4 SEV-2), re-QA
  blocked once (scope-marker leak) — both rounds produced fixes now CI-enforced.
- 2026-07-24 — **GPU/hw-transcoding column deferred to the next loop run** (verifier-approved
  but requires a schema extension; one schema change per reviewed batch — QA-capacity pacing,
  not calendar pacing). Remains queued in backlog.
- 2026-07-24 — **Verifier refutation rate 0/11 flagged for AUDIT**: coverage-gap items are
  mechanically confirmable so a high pass rate is plausible, but Monday's audit must red-team
  whether FIND verification is soft.
- 2026-07-26 — **ANALYZE this cycle stayed pre-launch/dataset-readiness framed, no traffic
  kills.** Evidence: repo 0 stars/0 forks/0 open issues, site 26 total hits (mostly operator
  checks) — OPERATIONS.md's pre-launch rule (readiness, not traffic, is the metric) applies
  cleanly; nothing meets any kill bar yet, nothing to kill.
- 2026-07-26 — **BUILD batch scoped down from 7 queued apps to 3 (Discourse, Zulip,
  Rocket.Chat) on a confirmed infrastructure constraint, not a judgment call.** Tested: Docker
  Hub API, ghcr.io registry API, and raw.githubusercontent.com are reachable from this cloud
  session; docs.portainer.io, learn.netdata.cloud, docs.joinpeertube.org, and vikunja.io are
  not (curl exit 56, both via WebFetch and direct Bash curl — connection-level block, not a
  tool limitation). Portainer/Netdata/PeerTube/Vikunja stay `queued`, unbuilt, for a local
  session or an owner-provisioned network allowlist (LEARNINGS #11, reconfirmed #18).
- 2026-07-26 — **Rocket.Chat's minimum-tier figure re-sourced live, not inherited from the
  FIND brief, and it had drifted:** brief said "1 core/1GB, ≤200 users/50 concurrent"; the
  live official table (a PNG embedded in otherwise-fetchable markdown, viewed directly) reads
  1 vCPU/2 GiB for a "Starter" tier at ≤25 concurrent users. Built on the live figure only.
- 2026-07-26 — **Independent verifier BLOCKED Zulip on first pass**: memcached (a real,
  confirmed-required compose.yaml service) had been omitted from deps rather than flagged, and
  `docker.source_url` cited compose.yaml for size/arches data that page doesn't contain. Fixed:
  added `memcached` to the deps enum (this batch's one schema change — GPU/community-figures
  stay queued) and re-pointed `docker.source_url` to the GHCR package page. Harvester≠verifier
  working exactly as designed — first pass caught a real gap before it reached QA.
- 2026-07-26 — **Discourse's Postgres/Redis classified as bundled (`service: none`), not
  external deps**, per Defect Class #12: the official all-in-one Docker image runs them via
  runit inside the same container (confirmed in discourse_docker's postgres template), same
  shape as Frigate's bundled ffmpeg. An advanced multi-container path exists but isn't the
  default/documented image this entry describes.
- 2026-07-26 — **Analytics-snapshot Action failure (2026-07-25, exit 22) flagged to owner**,
  not silently retried or worked around: cloud sessions can't reach the GoatCounter API to
  diagnose further (egress policy), and CI's two workflows don't cross-gate so the outage was
  invisible without checking Actions directly. Stats are 1 day stale as of this run.
- 2026-07-26 — **Independent QA BLOCKED the batch on first pass**: no fabricated/wrong figures
  (all sampled figures re-verified byte-accurate against live sources), but the "no external
  database" collection's fixed intro text ("no Postgres, no Redis... to feed and water") went
  false the moment Discourse joined with bundled-but-real Postgres/Redis. Fixed: reworded to
  "no separate container to run yourself" (build.mjs copy, not data). Also cleaned two QA nits:
  moved non-verbatim commentary out of Rocket.Chat's `quote` field into `scope`, and re-pointed
  Discourse's bundled-deps citation at discourse_docker's README (the actual bundling claim)
  instead of one template file. Rebuilt, full suite re-run green (38/38). All three entries
  marked `pending-second-qa` per the unattended-run rule — next run's fresh-eyes QA settles them.
- 2026-07-27 — **AUDIT #1: added a post-deploy smoke test to `ci.yml`** (curl the live Pages
  URL after `deploy-pages`, assert HTTP 200 + title marker, 5 retries). Evidence: this cloud
  session cannot reach `selfhostspecs.com` at all (proxy CONNECT 403, confirmed policy denial,
  not a site issue — an unrelated `orrery.github.io` control URL got the same block), so AUDIT's
  own mandated live-site check has been unexecutable from here since bootstrap; GH Actions
  runners have real internet and are the one place that can actually confirm a deploy is live.
  Also fixed a confirmed SEV-1: Vaultwarden's `docker.size_mb` had drifted 77→83 (rolling
  `latest` tag rebuilt after harvest) — pulled and corrected, LEARNINGS #27 flags that
  docker-size figures need AUDIT-cadence re-checks, not just the 90-day RAM/CPU sweep.
