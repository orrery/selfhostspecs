# AUDIT log

Weekly adversarial audit findings, newest first, ranked by severity. An empty audit must say
what it tried and failed to break. First audit due after the first full loop cycle.

## 2026-08-31 — AUDIT #6

**SEV-2 — 4/12 sampled `docker.size_mb` drifted** (rolling `:latest` repushes, fixed +
changelog'd): discourse 1255→1259 (8th drift on this field), nextcloud 530→527, n8n 356→360
(4th), coolify 130→134. Re-derived via Docker Hub v2 registry API (amd64 manifest sum),
cross-checked against the registry's own `full_size` — exact agreement. 8/12 matched exactly
(nginx-proxy-manager, grafana, syncthing, code-server, gitlab-ce, jenkins, wazuh, immich); no
RAM/CPU drift on any of the 12.

**SEV-2 — nextcloud's RAM quote had markdown bold markers stripped at harvest** (Defect Class
#8, same class as AUDIT #5's fixes): stored "...minimum of 128MB RAM..." vs source's literal
"...minimum of **128MB** RAM... recommend a minimum of **512MB**..." — confirmed via the
`nextcloud/documentation` docs-as-code mirror (`docs.nextcloud.com` itself is proxy-blocked).
No value/scope drift — restored verbatim.

**Data audit.** Random-sampled 12 live apps (nginx-proxy-manager, discourse, nextcloud, n8n,
grafana, coolify, syncthing, code-server, wazuh, gitlab-ce, immich, jenkins), exceeds the
≥10 minimum. 6 RAM/CPU sources on `raw.githubusercontent.com` matched verbatim on first pass.
`docs.nextcloud.com`/`grafana.com`/`nginxproxymanager.com`/`docs.syncthing.net` are
proxy-blocked (standing since AUDIT #1) — per LEARNINGS #66, used in-repo docs-as-code GitHub
mirrors instead of holding unverifiable: nextcloud (found the defect above), grafana (clean),
syncthing + nginx-proxy-manager (both `no_official_figure` absences confirmed still honest).
immich's docs live inside its main repo — fetched directly, clean. n8n's absence claim could
NOT be re-verified this session: `docs.n8n.io` blocked, and the `n8n-io/n8n-docs` GitBook
repo's file layout didn't match any guessed path in budget — flagged, not a defect; next
audit should resolve the path or `add_repo` it. Bonus (not in the 12, but highest-risk item
about to go live): Mailcow's pending-second-qa RAM figures + its `postfix` image size
re-verified byte-for-byte — clean.

**Staleness sweep.** Zero figures crossing 90 days across all 44 tracked apps (oldest 07-24,
38 days) — too young to bind yet.

**Hostile pass.** Built+served `docs/` locally (live domain still proxy-blocked; CI's
post-deploy smoke test on `ac410bb` reached the real site and passed: HTTP 200 +
"SelfhostSpecs" marker). Playwright: 320px viewport ×2 pages (no overflow), zero-result
search (no stray undefined/NaN), 5 URL-tamper payloads (all correct 404/200, nothing
reflected unescaped), JS-disabled fallback (4582 chars real content), corrupted-localStorage
reload (no crash). 10/10 passed.

**Process audit.** Session started on clean `main` synced with `origin` — **no detached-HEAD
reconciliation needed, first time since AUDIT #2** (AUDIT #3/#4/#5 each found 8-9 unpushed
commits); LEARNINGS #75's fix appears to have worked, one clean run isn't proof yet — recheck
next audit. `git log -- tests/` since AUDIT #5: one commit (Defect #15's build-integrity
test) — coverage added, nothing weakened. Backlog counts (40 live/4 pending-second-qa/44
total) exact-match data files. Ledger unchanged ~$11. Cadence: `specs-find` committed daily
08-23→08-30 no gaps (FIND #29→#36); `specs-loop` fired both Wed 08-26 + Sun 08-30; `specs-
audit` fired exactly 7 days after AUDIT #5 — **first cadence-gap-free week confirmed with
zero ambiguity** (every slot has a matching commit, no `last_fired_at` guessing needed).

**Red-team the week's biggest decision** (Defect Class #15: Mailcow's `postfix` container as
representative `docker.size_mb` for an 18-container bundle): the disclosure note is real
mitigation, but the pick is still somewhat arbitrary — dovecot/rspamd/sogo are each
user-facing in their own right, unlike Wazuh where `wazuh-manager` is unambiguously core. A
reader skimming the size column can't tell Mailcow's "110MB" apart from a true single-
container app's without opening the note. Recommend the index page itself mark bundled-app
rows, not just the per-app note, before this repeats on a less carefully-QA'd entry.

**Missing invariant.** Repeat: no automated cadence-gap detector (AUDIT #5). New this run:
**no test asserts every `docker.source_url` domain is one this sandbox can actually reach for
re-verification** — nothing stops a future harvest citing a technically-valid but
permanently-unauditable source (the n8n gap above is exactly this failure mode, just not yet
on a `docker.source_url`). Not CI-checkable (no live-reachability test), but a standing
harvester note: prefer re-checkable sources.

**Evidence:** 65/65 green before/after (40 live, 4 pending-second-qa unchanged; 48 pages from
44 entries). Commits: 4 docker-size fixes + 1 quote-formatting fix (nextcloud) + 5 changelog
entries; AUDIT.md compacted for AUDIT #5 (full text `reports/archive/AUDIT-2026-08-24.md`);
this entry.

## 2026-08-24 — AUDIT #5 (compacted; full text `reports/archive/AUDIT-2026-08-24.md`)
57/57 green. SEV-1: 7/32 docker-size drifts (22%, worst week on record — keycloak, chatwoot -6%,
discourse 7th, gitlab-ce, grafana +25% (never-re-verified bootstrap entry), n8n, linkwarden), all
fixed+changelog'd. SEV-1: linkwarden's quote no longer verbatim at its rewritten source (value
coincidentally still correct) — re-sourced. SEV-2: 7 quote fields across 4 apps had markdown
silently stripped at harvest — restored verbatim (Defect Class #8). SEV-2: 9 commits sat unpushed
in detached HEAD at session start (3rd occurrence, AUDIT #3/#4 lineage) — reconciled+pushed. SEV-2:
no commit trail for specs-loop's Wed 08-19 slot (4th cadence-gap finding across 5 audits) — owner
flag + LEARNINGS #68 (cadence tripwire, not built). Hostile pass (10 checks) clean. Red-teamed
FIND #29's Zitadel hold as conflating sourceable with worth-building. Missing invariant: no
automated cadence-gap detector (repeat finding).

## 2026-08-17 — AUDIT #4 (compacted; full text `reports/archive/AUDIT-2026-08-17.md`)
53/53 green. SEV-2: 8 commits sat unpushed in detached HEAD (worst instance yet of the recurring
pattern) — reconciled, pushed, CI green. SEV-1: 6/26 docker-size drifts fixed (discourse's 6th
recorded drift; home-assistant, mattermost, n8n, openproject, nextcloud). New Defect Class #14:
untagged `docker.image` with no `:latest` on the registry (Wazuh, Immich) — fixed, flagged as a
standing non-CI-checkable re-check. First fully cadence-gap-free week on record. Red-teamed
FIND #22's queue/hold calls as sound but noted the "correction" framing rests on one blog.

## 2026-08-10 — AUDIT #3 (compacted; full text `reports/archive/AUDIT-2026-08-10.md`)
45/45 green. SEV-1: 4 docker-size drifts fixed (Discourse 1144→1164, 4th occurrence on that
field; n8n, Rocket.Chat, Home Assistant first drifts). SEV-2: 10 apps' `docker.source_url` cited
a raw Docker Hub `/v2/` API JSON endpoint, not a citation page — repointed, CI now rejects `/v2/`
in `docker.source_url` for any registry. Found AUDIT #2's favicon fix was tag-only (never wrote
`docs/favicon.ico`, 404 in prod 7 days) — genuinely fixed + CI existence check added. No new
cadence gaps (3 gaps/2 routines/3 weeks still open). Red-teamed FIND #16's Sentry/PostHog hold —
defensible but flagged risk of a third silent hold.

## 2026-08-03 — AUDIT #2 (compacted)
SEV-1 Discourse docker-size drift fixed (1173→1144, 3rd occurrence — see AUDIT #3, now 4th).
SEV-2 Immich drift fixed (761→763). Found+fixed missing favicon `<link rel="icon">` + CI check
— **AUDIT #3 found this fix was incomplete** (tag present, but literal `/favicon.ico` still
404'd; now genuinely fixed). Cadence gap found (`specs-find` no commit 07-28). Red-teamed the
07-30 same-run QA pass: later cross-session re-QA caught defects the same-session pass missed
(LEARNINGS #42). 45/45 green before/after.

## 2026-07-27 — AUDIT #1 (compacted)
SEV-1 Vaultwarden docker-size drift fixed (77→83, rolling `latest` tag — first instance of the
pattern later recurring on Discourse). SEV-2: sandbox cannot reach selfhostspecs.com or any
standalone docs domain at all (proxy 403) — added a CI post-deploy smoke test as mitigation. No
cadence gaps found (all 3 routines on schedule this first week). 38/38 green before/after.
