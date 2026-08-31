# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

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

## 2026-08-27 — FIND #33

72. **A harvester can silently soften a source's own "required" label into "recommended"**
    — Activepieces' cited sizing table states S3 is "a hard requirement, not a nice-to-have"
    at production scale, but the harvester's dep summary called it "strongly recommended,"
    caught only because the verifier re-read the same doc the quote came from. → verifiers:
    when a candidate's own cited source contains a severity word (required/optional/
    recommended), diff the harvester's paraphrase against that exact word, not just the
    quoted figure.

## 2026-08-26 — FIND #32

71. **A harvester-drafted quote can be fabricated even with a real file open in front of it** —
    FIND #32's Dify candidate cited a "Minimum required for operation: ..." line as a compose
    file comment; the verifier grepped both the file and its template for "minimum" and found
    zero matches, while the REAL official figure (`CPU >= 2 Core - RAM >= 4 GiB`) was sitting
    in the repo's own top-level README the whole time, unchecked. Cost nothing here only
    because verification is mandatory pre-queue. → FIND/BUILD harvesters: check the repo
    README for a stated system-requirements section before declaring `no_official_figure` or
    drafting any quote from memory of a fetched page; never paraphrase a quote into a
    plausible-sounding line, copy the literal string or don't cite it.

## 2026-08-26 — ANALYZE+BUILD (specs-loop)

69. **LEARNINGS #65's OR-dep prose gap was live-site-harmful, not just cosmetic** — fresh-eyes
    QA on Kestra found `noExternalServices()` used required:false+required:false OR-modeling to
    falsely list it on the "no external database" collection page (Kestra's own compose has no
    db-free standalone mode). Fixed by making the compose-file default `required:true` (matches
    paperless-ngx precedent) and rendering `deps[].note` in `build.mjs` (previously written but
    never rendered). → Any future either/or dep: default-per-official-compose is `required:true`,
    alternates `required:false`, always with a `note`; check collection-membership predicates
    against the fix, don't just eyeball the per-app page.
70. **`depNotes`'s `Set`-based dedup silently collapses byte-identical `note` strings across
    multiple dep entries** (found on nginx-proxy-manager's mysql+mariadb, same note text) —
    harmless today (no content lost, reads as one shared paragraph) but untested, per QA 08-26.
    → Next build.mjs touch: add a build-integrity test asserting every distinct dep note in the
    data appears in its rendered app page, so a future regression here fails CI, not QA eyeballing.

## 2026-08-24 — AUDIT #5

68. No automated cadence-gap detector exists (4/5 audits found a gap manually); AUDIT #6
    confirmed cadence clean but the tripwire still isn't built — standing owner flag.
66. Docs-mirror recovery pattern (blocked vendor domain → GitHub docs-as-code mirror via
    raw.githubusercontent.com) — proven 4 more times by AUDIT #6 (nextcloud/grafana/
    syncthing/nginx-proxy-manager), now standard practice, not just a FIND-time move.
64. traefik SERVICES enum gap — resolve before Dokploy's BUILD (detail: backlog Dokploy entry).

## Compacted (graduated into CI tests / defect classes, or superseded — see OPERATIONS.md,
tests/*.test.mjs, full history: reports/archive/learnings-compacted.md)
