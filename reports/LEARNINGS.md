# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-09-01 — FIND #38

79. **A blog citing "official docs say X" can still misstate the figure** — noted.lol claimed
    Pangolin's official minimum is "1GB RAM"; the verifier fetched the real source (docs mirror,
    `fosrl/docs-v2` raw GitHub, `docs.pangolin.net` itself egress-blocked) and found the actual
    quote is "1 vCPU, 2GB RAM, 8GB SSD sufficient for most deployments." Same failure family as
    #71 (fabricated quote) but from a third-party summarizer, not the harvester's own memory. →
    A blog attributing a figure to "the docs" is not a source; always fetch the primary doc
    (or its GitHub mirror) before scoring or queuing, never carry a blog's number forward.
78. **Multiple docker-compose files in a repo don't imply a DB-alternative (OR) dependency
    schema** — Pangolin ships `compose.example.yaml` (the documented prod reference, no DB) plus
    `compose.pgr.yaml`/`compose.drizzle.yaml` (dev-only tooling); the finder's filename-only scan
    guessed a Directus/Penpot-style DB-OR before the verifier read `quick-install.mdx` and found
    it's actually `deps:none`. → FIND-stage effort/schema scoring from compose filenames alone is
    unreliable; confirm which compose file the install docs actually reference before assuming
    an OR-dependency shape (defer the real call to BUILD either way).

## 2026-08-31 — FIND #37

77. **#75's own fix (detached HEAD) recurred on the very next session** — writing the
    mitigation into LEARNINGS didn't make the next run apply it, because it was never added
    as a checklist step any playbook actually reads. → Fixed properly this time: added as
    SKILL.md invariant #9, not just a LEARNINGS entry. General case: a LEARNINGS fix for a
    recurring mechanical failure must land in SKILL.md/OPERATIONS.md, not stay prose-only, or
    treat it as unfixed. (No data lost this time — origin/main already had the commits;
    only the local branch ref was stale.)

## 2026-08-31 — AUDIT #6

76. **AUDIT #5's quote-formatting fix (Defect Class #8, markdown stripped at harvest) was
    applied per-instance to the 7 fields it found, not as a full sweep of every pre-08-16
    entry** — AUDIT #6's 12-app sample turned up an 8th instance on nextcloud (a 07-24
    bootstrap entry AUDIT #5 didn't happen to sample) with the exact same signature (bold
    markers around the numeric figure dropped). Fixed, but the recurrence means more may
    still be lurking in the 24 apps AUDIT #5/#6 combined haven't yet re-checked. → Next
    AUDIT: treat Defect Class #8 as a standing full-sweep item on all pre-08-16 entries
    (the batches known to predate the "harvesters preserve markdown" fix), not just the
    random sample, until a sweep comes back clean once.
75b. **A docs-as-code GitHub mirror existing isn't enough — its file layout must actually be
    found before "docs-mirror recovery" (LEARNINGS #66) counts as done.** n8n's docs live at
    `github.com/n8n-io/n8n-docs` (confirmed reachable) but it's GitBook-based with an
    unguessed path structure; several plausible paths 404'd and the repo wasn't browsable
    without `add_repo`/API access this session. n8n's `no_official_figure` RAM/CPU claim is
    still unverified two audits running. → Either resolve the n8n-docs path next AUDIT
    (worth an `add_repo` this once to browse the tree) or explicitly downgrade the claim to
    "held, sourcing unconfirmed" rather than silently re-carrying it as settled.

## 2026-08-30 — FIND #36

75. **A prior session can leave HEAD detached, so its commits never reach `main` or origin
    with no error surfaced** — this run found 6 commits (a full app-shipping batch) sitting
    on a detached HEAD, `git status` clean, `origin/main` 6 commits behind, undiscovered
    until this FIND's own commit+push step. → Every stage: `git branch --show-current` before
    new work; if empty (detached), `git branch -f main HEAD && git checkout main` first.

## 2026-08-30 — ANALYZE+BUILD (specs-loop)

74. **A `required:true` dep can still hide a legitimate embedded/self-managed fallback the
    harvester never checked for** — Coder's `postgresql` dep is correctly `required:true`
    (compose.yaml default), but fresh-eyes QA found Coder's own docs also document a
    "Built-in database (quick)" path (`cli/server.go`, embedded-postgres) with no external
    container, scoped to POC use — not noted on the entry, so the page implied Postgres was
    unconditionally mandatory. Not a wrong figure, a missing note. → Before filing any
    `required:true` dep, grep the same source (and the binary's own flags/env vars, not just
    the compose file) for an embedded/quick-start/all-in-one variant; if one exists, add a
    `note` (homebox/NPM precedent) even when it doesn't change `required`.

## 2026-08-29 — FIND #35

73. **File-budget headroom must be checked at the START of every FIND/BUILD run, not
    discovered when a write fails** — this run found LEARNINGS.md at 7976/8000 (24B
    headroom) and opportunities.md at 9858/10000 (142B headroom) simultaneously, despite
    #62/#64 already establishing archive-not-trim — that fix was applied reactively
    per-section each time one file separately hit its ceiling, never as a standing pre-run
    check. → Every FIND/BUILD run: `wc -c` every path in tests/file-budgets.test.mjs's
    BUDGETS map before writing anything; compact proactively once headroom drops under
    ~500 bytes, don't wait for the next write to fail.

## 2026-08-26 — ANALYZE+BUILD (specs-loop)

69. OR-dep prose gap (Kestra false collection-inclusion) fixed → compose-default `required:true`
    precedent, now standard (full detail: archive).
70. `depNotes` `Set`-based dedup silently collapses byte-identical `note` strings across dep
    entries (nginx-proxy-manager mysql+mariadb) — harmless today, still no CI test for it.
    → add a build-integrity test asserting every distinct dep note renders on its app page.

## 2026-08-24 — AUDIT #5

68. No automated cadence-gap detector exists (4/5 audits found a gap manually); AUDIT #6
    confirmed cadence clean but the tripwire still isn't built — standing owner flag.
66. Docs-mirror recovery pattern (blocked vendor domain → GitHub docs-as-code mirror via
    raw.githubusercontent.com) — proven 4 more times by AUDIT #6 (nextcloud/grafana/
    syncthing/nginx-proxy-manager), now standard practice, not just a FIND-time move.
64. traefik SERVICES enum gap — resolve before Dokploy's BUILD (detail: backlog Dokploy entry).

## Compacted (graduated into CI tests / defect classes, or superseded — see OPERATIONS.md,
tests/*.test.mjs, full history: reports/archive/learnings-compacted.md)
