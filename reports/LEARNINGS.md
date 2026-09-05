# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-09-05 — FIND #41

83. **Detached HEAD recurred a 4TH time** (#75→#77→#81→now), despite SKILL.md invariant #9
    existing since #77. Confirmed harmless again (fresh `git fetch origin main` showed 0/0
    divergence — local HEAD == origin/main exactly) and fixed the same way. → #81's hypothesis
    (container/clone-setup artifact, not an agent-behavior gap) now has 2 data points since the
    "fix" landed; a checklist step an agent can only run/skip is not a fix for an environment
    default. Escalating per #81: next AUDIT should treat this as confirmed-environmental unless
    it can show a session where the checklist step was actually skipped (i.e. an agent-behavior
    explanation still on the table). Recommend owner-level fix: a `SessionStart` hook that runs
    `git symbolic-ref -q HEAD || git checkout main` automatically, since prose/checklist
    instructions provably don't survive fresh-context sessions 4 times running.

## 2026-09-04 — FIND #40

82. **A WebSearch summary's "gaining Nk stars/7 days" velocity claim can be wrong by 4x** —
    FIND cited VoiceStudio at "~3.7k stars/week" from a search snippet; the verifier checked
    `created_at` vs `stargazers_count` via the GitHub API and found lifetime average is
    ~850/week — the snippet's number was unverifiable and likely a stale/wrong trending-site
    scrape. → Never carry a search-engine velocity/trend claim into a score or backlog entry
    without an independent count (repo age vs star count, or a specific dated snapshot);
    cite the confirmed absolute number instead.

## 2026-09-03 — FIND #39

81. **Detached HEAD (#75) recurred a THIRD time despite #77's SKILL.md invariant #9 fix** —
    this run started detached again (HEAD matched origin/main exactly, no data at risk, but
    the checklist step alone isn't preventing recurrence, just catching it after the fact).
    → Root cause still unaddressed: something about how these cloud runs start the session
    leaves git in detached HEAD. Next AUDIT: check whether this is a container/clone-setup
    artifact rather than an agent-behavior gap — a checklist item can't fix an environment
    default.
80. **A source can exist in a sibling file the harvester never opened, inside the SAME
    directory it did check** — Sure's RAM/CPU figure lives in `docs/hosting/hetzner.md`
    (a provider-specific guide), not `docs/hosting/docker.md` (the one the harvester
    fetched); the verifier only found it because the brief said "check the wider net of
    docs/hosting/*.md files." → When a docs/ directory has multiple files and one is
    checked clean, list and skim every file in that directory before concluding
    no_official_figure — a hosting-provider guide is a common place for a figure the
    generic install doc omits.

## 2026-09-01 — FIND #38 through AUDIT #6 (full detail: archive)

76–79, 75b. Blog-cited figure misattribution (Pangolin); compose-filename-only OR-dep
    guessing (Pangolin); Defect Class #8 recurrence (nextcloud, 8th instance, standing
    full-sweep item); n8n GitBook docs-mirror path unresolved, `no_official_figure` still
    unconfirmed. → superseded/detail: archive.

## 2026-08-31 — FIND #37 (full detail: archive)

77. Detached-HEAD fix (#75) recurred next session, prose-only LEARNINGS didn't stick →
    added as SKILL.md invariant #9. **Superseded: see #83 above, invariant #9 did not hold.**

## 2026-08-30 — FIND #36

75. Detached-HEAD-after-prior-session, first occurrence (full detail: archive). →
    superseded by #77/#81, still open as a root-cause question.

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

73. File-budget headroom check: reactive → standing pre-run `wc -c` habit (full detail:
    archive). Applied every run since.

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
