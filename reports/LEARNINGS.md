# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-07-24 — First full BUILD/TEST cycle (14 entries)

9. **Quotes written from notes drift: 3 of 4 seed quotes were paraphrases** (only Immich's
   survived byte-for-byte); one seed cited the wrong docs page outright. → Downstream: quotes
   are copied only from a live fetch in the same session — never from research notes. Seeding
   from memory is banned.
10. **FIND intel produced without live fetches is unreliable in both directions:** it claimed
    figures AdGuard doesn't have and (via the harvester trusting the "hardware page" framing)
    helped miss figures Frigate does have — on a sibling page (planning_setup). → Downstream:
    absence claims require a sibling-page sweep of the docs tree, not just the obvious page;
    FIND sourceability scores from a no-fetch environment are estimates and say so.
11. **The cloud routine environment 403s most external docs domains** (GitHub/Docker Hub work).
    → Downstream: cloud runs do FIND scoring, backlog work, and derived builds; anything
    needing external-docs fetches (harvest, verification) runs in local sessions — or the
    owner provisions a cloud environment with a network allowlist. Flagged to owner.
12. **QA on our own first build found 4 SEV-2s** — silent absences the schema test didn't
    enforce (now it does: field-level completeness), a reused template helper rendering a
    false label, scoped figures unmarked in sortable tables, and a freshness claim ahead of
    reality. Three new defect classes (10–12) added to OPERATIONS.md. → Downstream: the
    builder checklist grew; the schema contract now makes silent absence impossible.
13. **Registry tags: `:latest` often doesn't exist** (Immich uses `:release`, Frigate
    `:stable`). → Downstream: record the tag in the image string whenever it isn't `latest`;
    a size without its tag is unattributable.

## 2026-07-24 — Infrastructure wiring

0. **A 404 from an authenticated API is not proof of absence.** GoatCounter masks
   permission denials as 404s; the operator declared `/stats/total` nonexistent from a single
   404 with one token, and the "fix" would have silently dropped a working data source. The
   owner's revert was correct. → Downstream: before declaring any endpoint/source dead, test
   with a second credential or from a second vantage point, and treat auth-adjacent 404s as
   "permission?" first. This is defect-class thinking applied to our own tooling.

## 2026-07-24 — Bootstrap research sprint (5 finders, 2 verifiers)

1. **Verification cuts finder scores 20–40%; design for it.** Finders proposed at 15/20;
   adversarial verification landed everything at 9–12.5. → Downstream: FIND scores are
   provisional until verified; never build on finder enthusiasm; expect and budget the haircut.
2. **One synonym sweep can kill a candidate.** The classroom mail-merge idea died to a single
   rephrasing that surfaced free incumbents with the identical privacy claim. → Downstream:
   the verifier brief for every candidate (apps, collection pages, columns) REQUIRES a synonym
   sweep, and "no incumbent found" is only claimable after ≥3 distinct phrasings.
3. **Channel claims must be audited concretely, not believed.** "public-apis merges PRs" was
   false (recent PRs closed unmerged); "itch.io surfaces new packs immediately" was false
   (10+ days unindexed). → Downstream: any distribution assumption in a spec cites a checked,
   dated precedent or it doesn't count.
4. **Official docs are sparser than expected: ~2 of 7 popular apps state a clean RAM minimum.**
   → Downstream: lead with always-harvestable columns (deps, image size, ARM); the RAM column
   is sourced-or-honestly-absent; "no official figure" rows link upstream issues (captured demand).
5. **The moat is pipeline depth, not the idea.** selfh.st could add a specs column in a weekend;
   dated quotes, re-verification, and a change log are what they'd have to rebuild. → Downstream:
   never ship a figure without the full provenance object; the changelog is a product, not a log.
6. **Owner territory exclusions are absolute:** no interactive calculators/tools, no games —
   including natural expansions (the "will my box fit" calculator is banned). → Downstream:
   FIND screens every candidate against the exclusions before scoring.
7. **Repeat community submissions decay** (awesome-selfhosted HN resubmits fell from 194 to
   4–6 pts). → Downstream: the launch is one-shot; the launch gate in OPERATIONS.md exists
   because of this. Don't burn the moment on a thin dataset.
8. **Schema honesty catches real contradictions immediately.** The very first six seed entries
   produced one (Home Assistant: scoped figure + blanket absence declaration). → Downstream:
   scoped figures carry the scope in the figure; absence declarations only for fields with NO
   figure in any scope.
