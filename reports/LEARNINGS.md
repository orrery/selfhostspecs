# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-07-26 — ANALYZE + BUILD (Discourse, Zulip, Rocket.Chat)

23. **A fixed prose block can go stale the moment a new member joins its collection.**
    The "no external database" collection's copy said "no Postgres, no Redis... to feed and
    water" — true for every prior member (zero DB dependency) but false once Discourse joined
    with Postgres/Redis genuinely running, just bundled in its own container. QA caught it as
    a reader-facing overstatement, not a data error. → Downstream: collection-page copy that
    makes a blanket claim about members must be re-read against the NEWEST member added, not
    just checked once at the copy's creation; reworded to "no separate container to run
    yourself" (true for both zero-dep and bundled-dep members).
24. **`quote` must stay pure transcription — methodology commentary belongs in `scope`.**
    Rocket.Chat's quote field had "(table image, transcribed from...)" appended inline; QA
    flagged it as the first instance of commentary inside a field the schema requires to be
    verbatim. → Downstream: when a figure comes from a non-text source (image, PDF), put the
    "how we read this" explanation in `scope`, never appended to `quote` itself.
18. **Cloud-run egress is domain-specific, not blanket, and finer than LEARNINGS #11 implied.**
    `raw.githubusercontent.com`, Docker Hub's `hub.docker.com/v2/...` API, and `ghcr.io`'s v2
    registry/token endpoints (via `curl`) all work from this cloud session; standalone docs
    domains (vikunja.io, docs.portainer.io, learn.netdata.cloud, docs.joinpeertube.org,
    docs.rocket.chat) still hard-block (curl exit 56, connection-level, confirmed with both
    WebFetch and raw Bash curl). → Downstream: before holding a queued app for "needs a local
    session," check whether its official source has a GitHub-hosted mirror (docs-as-markdown
    repo, or a GHCR-hosted image) — Discourse and Zulip both built this cycle purely via
    GitHub-hosted sources; Portainer/Netdata/PeerTube/Vikunja have no such mirror and stay held.
19. **A requirements table can be a PNG embedded in an otherwise-fetchable markdown file**
    (Rocket.Chat's system-requirements.md renders its numbers as three GitBook screenshot
    images, not text). WebFetch's markdown conversion silently drops image content — a harvester
    that stops at the text pass would wrongly conclude "no figure." → Downstream: when a fetched
    doc references `.gitbook/assets` or similar image embeds near a requirements section,
    download and view the image directly (Read tool) before declaring the figure unsourceable.
20. **A harvester silently dropping an unrepresentable dep is still a defect, caught by the
    independent verifier (not the harvester): the deps enum had no `memcached`, so it was
    omitted from Zulip instead of flagged as BLOCK-worthy.** The verifier disputed it correctly
    — "schema can't express it" is not a reason to understate a confirmed required service. →
    Downstream: added `memcached` to the deps enum (this batch's one schema change; GPU/
    community-figures columns stay queued) rather than treat the gap as acceptable.
21. **Backlog-cited figures drift from what's live at harvest time, confirmed again:**
    the FIND-run brief for Rocket.Chat said "1 core/1GB for ≤200 users/50 concurrent"; the
    live official table today reads 1 vCPU/2 GiB for ≤25 concurrent users under a differently
    named tier. Re-sourcing at harvest time (never inheriting the brief's numbers) caught it,
    as the harvester note itself warned. → Downstream: nothing new — this is why that note
    exists on every batch; logged as a second concrete instance for the audit's evidence trail.
22. **Analytics snapshot Action failed 2026-07-25 (exit 22, GoatCounter API), silent since:**
    CI shows "Analytics snapshot" red on main while "CI & Deploy" stayed green — the two
    workflows don't gate each other, so a stats-collection outage isn't visible without checking
    Actions directly. → Downstream: ANALYZE must check the Analytics-snapshot workflow's own
    run status, not just infer freshness from `updated-at.txt` age; flagged to owner (likely
    token/site provisioning, cloud session can't debug — egress to GoatCounter blocked here too).

## Compacted (graduated into CI tests / defect classes — see OPERATIONS.md, tests/*.test.mjs)
- Auth-adjacent 404s can be permission masks, not absence — verify from a second vantage point.
- Seed quotes from memory drift; harvest quotes only from a live fetch in the same session.
- No-fetch FIND scoring is an estimate; absence claims need a sibling-page sweep.
- First QA pass found 4 SEV-2s → defect classes 10–12 (template-label reuse, OR-flattening,
  bundled-dependency misclassification) — now CI/QA-enforced, not re-litigated per batch.
- Registry tags: record the tag when it isn't `latest` (Immich `:release`, Frigate `:stable`).
- Verification cuts finder scores 20–40%; synonym sweeps kill candidates; channel claims need a
  checked, dated precedent; official RAM minimums are sparse (lead with always-harvestable
  columns); the moat is provenance depth, not the idea; territory exclusions are absolute;
  repeat community submissions decay (one-shot launch); scoped ≠ general figures.

## 2026-07-25 — FIND run #3 (4 new apps queued)

15. **Unofficial doc mirrors are a live collision risk:** `zulipaaa.readthedocs.io` mirrors
    Zulip's docs under a confusable name; Rocket.Chat has GitHub doc forks (abrom, iuvei). →
    Every harvester note must name the canonical org-owned domain/repo explicitly.

## 2026-07-24 — FIND run #2 (3 new apps queued, 1 collection held)

14. **Component-vs-whole-app scoping is a new shape of Defect Class #3.** Nextcloud's sourced
    "128MB RAM" is scoped "per process" — a real install runs several processes plus a database.
    → Any collection/filter over `ram_min_mb` must check `scope` for per-process language.
