# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

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

68. **No automated cadence-gap detector exists — the 4th time across 5 audits that "did a
    scheduled routine actually fire" has been the finding, always discovered up to 6 days late
    by AUDIT manually diffing commits against cron expressions.** This run: `specs-loop`
    (Sun+Wed cron) has commits for Sun 08-16 and Sun 08-23 but nothing for Wed 08-19, while
    `specs-find` (daily) committed every day in between — the trigger API's `last_fired_at` only
    reports the most recent fire, so it can't confirm whether 08-19 fired silently or not at
    all. → Owner flag: a cheap CI-independent tripwire (scheduled Action failing/notifying if no
    operator commit lands within N hours of each cron slot) would catch this same-day; not built
    this run (AUDIT doesn't build).
67. **A harvested `quote` must be copy-pasted from the fetched source, never retyped** — 7
    quote fields across 4 live apps (chatwoot, openproject, seafile, plausible-ce) had markdown
    emphasis markers silently dropped during harvest (e.g. "Memory: 4096 MB" stored vs the
    source's literal "**Memory:** 4096 MB"), failing Defect Class #8's literal-presence bar with
    zero value/scope drift — caught only because this audit did a byte-for-byte substring check
    against freshly-fetched sources instead of an LLM gist match. Newer batches (coolify, 08-16)
    already preserve markdown verbatim, so the fix is discipline, not code: harvesters should
    paste the exact source string, not transcribe its meaning.

## 2026-08-23 — FIND #29

66. **A vendor's marketing-docs domain being egress-blocked doesn't mean the figure is
    unsourceable — check for an in-repo docs mirror first.** This session's network proxy
    blocks nearly every vendor docs domain (pocketbase.io, zitadel.com, appwrite.io, and in
    earlier ad hoc checks dify.ai/langfuse.com/librechat.ai/netbird.io/mealie.io/reddit.com
    all 403'd) while github.com/raw.githubusercontent.com/api.github.com/hub.docker.com stay
    reachable. The harvester wrote off Zitadel as unsourceable on that basis; the verifier
    found its docs are mirrored in-repo (Docusaurus monorepo under `apps/docs/content/`) and
    pulled a verbatim official RAM figure via raw.githubusercontent.com. → Before holding a
    candidate as "docs blocked," GitHub code-search the vendor's own org for a docs-as-code
    mirror and try raw.githubusercontent.com paths — only hold on reachability after that
    comes up empty too (as it did for PocketBase and Appwrite this run).

64. traefik SERVICES enum gap — resolve before Dokploy's BUILD (detail: backlog Dokploy entry).

## Compacted (graduated into CI tests / defect classes, or superseded — see OPERATIONS.md,
tests/*.test.mjs, full history: reports/archive/learnings-compacted.md)
