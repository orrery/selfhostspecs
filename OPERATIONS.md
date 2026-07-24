# SelfhostSpecs Operations Manual

CASH (Claude Accelerates Sustainable Hypergrowth) — this project applies the growth-automation
loop (Identify Opportunities → Build → Test Quality → Analyze Results, continuously, learnings
fed back into every next iteration) as an autonomous micro-business engine run by Claude.

**Business model:** SelfhostSpecs (https://selfhostspecs.com) is a sourced, dated,
change-tracked reference database of hardware requirements and runtime footprints for
self-hosted applications — RAM/CPU figures carrying official-source citations with retrieved
dates, external-service dependencies (Postgres/Redis/etc.) parsed from official compose files,
Docker image sizes, and ARM/Raspberry Pi support — presented as a fast, filterable static
site with a per-app page for every entry. The moat is pipeline depth incumbents can't copy in
a weekend: every figure sourced, dated, re-verified on a schedule, with a public changelog
when upstream requirements change. Traffic: community launch (r/selfhosted, Show HN — proven
channel: awesome-selfhosted front-paged HN at 194/137/91 pts), GitHub visibility of the open
data, long-tail SEO on per-app "requirements" pages, and LLM citation of dated source-linked
tables. Monetization once traffic proves out (never before): disclosed affiliate links at the
point of hosting decisions (DigitalOcean $25 cash CPA via Impact — verified 2026-07-24;
PikaPods referral), later sponsorship of the reference (the JSONPlaceholder model).

Owner: Antony (antony.iorio@icloud.com). Operator: Claude. Started: 2026-07-24.

## Ground rules
1. Zero spend without explicit owner confirmation. Log every dollar in the Budget Ledger.
2. Everything static, free-tier, self-contained: GitHub Pages hosting, GoatCounter analytics.
3. Nothing deceptive: no fake data, no fabricated figures, no undisclosed affiliate links, no spam.
4. Every state change is committed to git with a clear message; every scheduled run ends with a digest to the owner.
5. Experiments are cheap and disposable. Kill without sentiment; scale only on evidence.
6. Every overarching plan or directive — owner directives included — gets an adversarial pass
   before implementation: strongest counter-case, failure modes, cheaper alternative. Material
   findings surfaced first. (Standing owner directive, inherited 2026-07-24.)
7. Tests are load-bearing: never delete or weaken a test to go green — fix the product.
   Legitimate test changes must say so in the commit message; AUDIT reviews `git log -- tests/`.
8. **Source-or-silence:** every published figure carries a source URL, a supporting verbatim
   quote (or precise locator), and a retrieved date. A figure that cannot be sourced is
   published as "no official figure" — never estimated, never borrowed from unsourced third
   parties. Honest absence is a feature (link the upstream issue asking for the number).
9. **Harvester ≠ verifier:** no figure goes live until a second agent that did not harvest it
   re-fetches the source and confirms quote, value, units, and scope. Research is judged like
   code: the writer never grades their own work.
10. **Community posting is owner-in-the-loop only.** The operator drafts launch/update posts;
    the owner reviews and posts from his own accounts. No autonomous posting anywhere.
11. **Permanent territory exclusions (owner directive 2026-07-24):** no interactive
    calculators/tools and no games — including as expansions. The natural "will my box fit
    this stack" calculator is explicitly banned (owner's other property's territory).
    Filter/sort over the dataset is a data property and is fine; computing new user-specific
    answers is not.

## The loop

### 1. FIND (Identify Opportunities) — runs daily (routine: specs-find)
Read `reports/LEARNINGS.md` first; apply its adjustments. Opportunity types, in priority order:
- **Coverage gaps:** popular self-hosted apps not yet in the database. Sources: awesome-selfhosted
  (popularity via GitHub stars), r/selfhosted hot discussions, "requirements" questions in app
  GitHub issues (each unanswered issue is captured demand for one row).
- **Column opportunities:** new harvestable fields (e.g., GPU need for transcoding/AI apps,
  storage footprint, idle vs load RAM where officially documented).
- **Collection pages:** filtered views with real search demand ("apps that run on 1GB VPS",
  "self-hosted apps without Postgres", "Raspberry Pi-ready apps") — each treated as a product:
  SERP check + adversarial verification before build, like any littlecalcs-style candidate.
- **Freshness work:** entries whose sources changed (diff alerts) or whose retrieved dates aged out.
Score candidates 1–5 on: Coverage-value (popularity × demand evidence) · Sourceability (do
official figures/compose files exist?) · Effort (batch-friendly?) · Channel-value (does it
strengthen a launch/SEO/collection story?). Total /20; ≥14 = build candidate AFTER verification.
**Adversarial verification (mandatory):** a second agent re-checks: app not already covered
(synonym/alias sweep — projects rename), sources actually exist and are official, the demand
evidence is real, and for collection pages: the SERP isn't already owned by a good incumbent.
Unverified = unbuildable. Refuted candidates go to the rejected list with the refutation.

### 2. BUILD — triggered by verified backlog items
Read `reports/LEARNINGS.md` before starting. Unit of work: a batch of app entries (or one
collection page). Per app entry:
- Harvest into `data/apps/<slug>.json` per the schema (`tests/data-schema.test.mjs` is the
  contract): every figure with `{value, source_url, quote, retrieved, scope}`; deps from
  official compose/docs; Docker image + size from Docker Hub API; ARM support with evidence;
  `no_official_figure: true` + upstream issue link where the number doesn't exist.
- **Independent verification pass (rule 9):** a second agent re-fetches every source and
  confirms every field before status can move past `pending-verification`.
- `node scripts/build.mjs` regenerates the site (index, per-app pages, apps.json, sitemap,
  changelog). Never hand-edit `docs/` — it is build output.
- Run the suite locally; commit data + any build/test changes with a clear message.
Follow `.claude/skills/data-quality/SKILL.md` for schema discipline, page conventions, and the
Known Defect Classes checklist (every builder addresses ALL of them; QA and AUDIT verify).

### 3. TEST — quality gate, automatic after every build
Deterministic in CI (`node --test tests/*.test.mjs`: schema validation of every data file,
build integrity, whole-site invariants — analytics snippet, canonical, viewport, sitemap
completeness, JSON-LD parseability, no dead internal links, no NaN/undefined artifacts).
Deployment to selfhostspecs.com happens ONLY from a green `CI & Deploy` run — red = site did
not update. On top of CI, judgment work by an independent QA agent that did not build the batch:
- Sample re-verification: open N random sources from the batch; confirm quote fidelity, units,
  scope, min-vs-recommended assignment.
- Hostile pass over the site: filters with zero results, absurd sort states, mobile viewport,
  non-Chromium rendering, corrupted localStorage (if any state is stored).
- Claims audit: every sentence on every page literally true (especially "every figure sourced
  and dated" — spot-check it), affiliate links (once live) disclosed.
Fail → back to BUILD. Builds from unattended runs are marked `pending-second-qa` and re-QA'd
with fresh eyes next run before counting as settled.

### 4. ANALYZE — runs Wed & Sun (routine: specs-loop)
Read GoatCounter snapshot (`reports/stats/`), GitHub stars/traffic, Search Console (via owner
until API wired). Channel-latency-aware rules:
- **Pre-launch phase:** the metric is dataset readiness (entries verified, defect classes clean),
  not traffic. Launch gate below.
- **Post-launch, community traffic:** evaluate collection pages and columns, not the site:
  a collection with zero entries-clicks after 4 weeks of real site traffic → iterate or kill.
  Per-app pages are cheap rows, not experiments — they aren't killed, only corrected.
- **SEO tail:** new-domain latency is 6–12 weeks; no SEO-based kills before week 10, and kills
  need BOTH no impressions trend AND no internal-nav usage.
- **Double-down** (new columns, collection families, launch #2): highest evidence bar — signal
  quality, minimum sample, corroboration, written hypothesis, and the decision is red-teamed
  by the next AUDIT. Kills cheap; promotions earned.
Write `reports/YYYY-WW.md`, append to `reports/DECISIONS.md`, update LEARNINGS, digest to owner.
**Rolling expansion:** verified backlog items are built automatically by the next run — owner
informed via digest, never asked. No numeric caps, no calendar gates; the only pacing is QA
capacity, and any pacing decision must cite its evidence in DECISIONS.md.

### 5. AUDIT — runs weekly Monday (routine: specs-audit)
An independent skeptic that did not do the week's work. Assume the operator made mistakes; find them.
- Mechanical: run the CI suite; confirm last deploy workflow green; live-site spot check over
  HTTPS; ask what invariant the suite is MISSING (a test gap is a finding).
- **Data audit (the heart of it):** random-sample ≥10 live figures → re-fetch sources → confirm
  value, quote, units, scope, and that retrieved dates are honest. One fabricated or drifted
  figure is a SEV-1: pull the figure, fix the pipeline gap that let it through, log the lesson.
- Staleness sweep: figures with retrieved > 90 days queue for re-verification; sources that
  changed get changelog entries (the changelog IS the moat — audit that it's true and complete).
- Break something: hostile inputs on the live site (filter edge cases, URL-param tampering,
  tiny viewports, non-Chromium).
- Process audit: LEARNINGS actually changed behavior; ledger honest; backlog statuses truthful;
  scheduled runs fired (DECISIONS.md cadence gaps).
- Red-team the week's biggest decision in ≤5 sentences.
Output: append to `reports/AUDIT.md`, findings ranked by severity. An empty audit must say what
it tried and failed to break.

## Launch gate (one-shot channel, owner directive pending)
The community launch (r/selfhosted post + Show HN) is a one-shot moment — repeat submissions
decay (verified: awesome-selfhosted resubmissions fell to 4–6 pts). Do not launch until:
≥100 popular apps live with the always-harvestable columns complete (deps, image size, ARM),
the RAM column sourced-or-honestly-absent for all, zero open defect-class findings, and the
changelog demonstrably working. The operator drafts the posts; the owner fires them (rule 10).
Pre-launch trickle (GitHub repo public, awesome-list PRs) is allowed and encouraged.

## Budget Ledger
| Date | Item | Cost | Approved by |
|------|------|------|-------------|
| 2026-07-24 | selfhostspecs.com 1yr (Porkbun) | ~$11 | Owner (approved at checkpoint; purchased directly — confirmed via live DNS 2026-07-24) |
Total spent: **~$11**. Standing cap: $0 unapproved.

## Infrastructure
- Repo: github.com/orrery/selfhostspecs — PUBLIC (owner decision 2026-07-24, made with the
  trade-off surfaced: open data/stars/corrections channel vs. visible playbook; owner has
  GitHub Pro so this was a choice, not a constraint). Nothing secret lives in the repo —
  tokens are Actions secrets only.
- Hosting: GitHub Pages via CI-gated deploy workflow; custom domain selfhostspecs.com.
- Analytics: GoatCounter site `selfhostspecs` (pending owner creation under existing account);
  snapshot Action writes reports/stats/ daily for cloud runs (egress policy blocks direct API).
- Site is built from `data/` by `scripts/build.mjs`; `docs/` is gitignored build output.
- Schedules: claude.ai cloud routines (manage at https://claude.ai/code/routines) —
  `specs-find` trig_01RmqEmUviFQm61LaDQS6ni3 (daily 23:23 UTC = ~9:23am Melbourne),
  `specs-loop` trig_01UuSPBJZ2eJeLUGi96L1cGW (Wed & Sun 08:41 UTC = ~6:41pm Melbourne),
  `specs-audit` trig_01XsWhF6rTVTYBpZgxALHtCR (Mon 08:41 UTC = ~6:41pm Melbourne).
  Cron is UTC-fixed, so local times shift one hour across Melbourne DST — accepted.
  They clone this repo in the cloud and push results.
- Search Console: DNS TXT verified present 2026-07-24; owner to submit sitemap.xml once the
  property shows verified.

## Known Defect Classes (BUILD/TEST checklist — every builder addresses ALL; AUDIT verifies)
1. **Unit errors:** MB vs GB vs GiB; store MB integers, display with the source quote visible;
   conversions must be shown in the quote or scope note, never silent.
2. **Minimum vs recommended conflation:** separate fields, never promoted in either direction;
   an app documenting only "recommended" has NO minimum (that's a `no_official_figure` on min).
3. **Install-path scoping:** a figure valid for one install method (e.g., Home Assistant OS on
   Raspberry Pi) must carry its `scope` and never be presented as the app's general requirement.
4. **Uncited figures:** CI rejects any figure object missing source_url/quote/retrieved.
5. **Staleness:** retrieved > 90 days → re-verify queue; source changed → changelog entry, same day it's noticed.
6. **ARM/Pi ambiguity:** specify architecture (armv7/arm64) and evidence (image manifest or docs
   statement); "works on Pi" without a Pi model + arch is not a claim we publish.
7. **Zero vs absent:** "no official figure" is a real, honest state — never blank, never guessed;
   link the upstream issue where one exists.
8. **Quote drift:** the stored quote must appear verbatim at the source; verifier and AUDIT check
   literal presence, not gist.
9. **DOM safety:** any page JS builds DOM via createElement/textContent — no innerHTML with data.

## Rejected directions (with refutations, from the 2026-07-24 research sprint)
- Static JSON "API hub" — occupied (dr5hn weekly-updated CDN datasets; concept exists at 21
  stars), channels dead (public-apis closing PRs unmerged; awesome-json-datasets archived).
- Classroom mail-merge printables — free no-signup incumbents incl. identical privacy claim
  (issuebadge, placecard.us, Avery merge).
- Emergency binder generator — empty slot but demand unevidenced twice; trust paradox. May
  revisit only with new demand evidence.
- CC0 trivia bank — real license gap; collapsed channels + accuracy-trust contradiction.
  Possible future side product, never the business.
