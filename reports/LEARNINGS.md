# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

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
