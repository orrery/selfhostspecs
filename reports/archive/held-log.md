# Held — full detail archive

Names + one-line reasons stay in `backlog/opportunities.md` for fast dedupe; full
evidence trail lives here. Moved here 2026-08-20 (FIND #26, file-budget relief,
precedent: LEARNINGS #62 shipped/rejected-log split).

## Held (insufficient evidence, not discarded)
- Snipe-IT/Cal.com (~12/20): no RAM/CPU figures (readme.io 403 on Snipe-IT).
- BigBlueButton (14/20): 16GB/8-core prod min; bare-Ubuntu, no Docker image — non-container schema needed.
- PeerTube (#15): figure is v3.0.0-era FAQ.md, 5 versions stale — don't ship stale.
- Vikunja (#15): docs-mirror angle exhausted (go-vikunja/website grepped clean).
- Plane (~12/20,#11): only EC2 quick-start advisory, crowds OpenProject.
- Redmine (#15): doc/INSTALL clean, zero figure; library/redmine Official Image, 8-arch.
- AFFiNE (~12/20,#11): repo grep empty, docs.affine.pro blocked.
- Forgejo (~7/20,#11): Codeberg blocked, GH mirror stale (Gitea fork).
- SonarQube (#15): "Xmx 1536M community build" is JVM-heap not system-RAM (Helm/K8s gap #13).
- Healthchecks (#15): docs blocked, docker README clean. Deps: postgres req, healthchecks/healthchecks, 4-arch.
- Sentry (12/20,#16) & PostHog (11/20,#16): strong sourcing but 64/47-svc composes; kafka/zookeeper/temporal not in enum — hold for deps-schema.
- Grocy (15/20,#17): zero figure; README redirects to 3rd-party linuxserver/grocy (78.7MB), no org image (Helm/K8s gap) — owner policy needed.
- Gotify (12/20,#17): org-owned gotify/server (48.1MB), gotify.net+mirrors unreachable — RAM-absence/SQLite-default unconfirmed.
- Windmill (~8/20,#19): n8n-alt ~17.5k★, windmill.dev blocked. Only RAM figure is a stale Traefik example (worker_native now 2048M vendor-side). Postgres only dep. Hold for reachable docs or a prose minimum.
- Ente (~11/20,#19): Immich-alt (E2EE) ~28.3k★. No RAM/CPU figure. Deps postgres+minio(unmapped)+socat — same unmapped-service shape as Supabase/Sentry/PostHog.
- Infisical (~14/20,#20): 28.8k★ secrets/PKI, non-dupe vs Vaultwarden. Finder's "2-4CPU/4-8GB" is app-tier only — req'd Postgres+Redis add ~6-8vCPU/16-20GB. Hold for full-stack scope write-up; deps enum-mapped, Docker infisical/infisical amd64+arm64 confirmed.
- LibreChat (13/20,#32): 42.5k★ multi-provider AI chat UI, NOT open-webui dupe (open-webui
  deps:none, LibreChat requires 5 services — genuine weight difference, Grafana/Keycloak-
  style multi-competitor precedent). Held on sourcing only: no official RAM/CPU figure
  anywhere (README, Helm values.yaml boilerplate; librechat.ai/www.librechat.ai blocked,
  no danny-avila/librechat.ai docs repo). Deps if re-scored: mongodb+meilisearch+pgvector+
  rag_api+admin-panel ALL required (no `profiles:` key in compose). Re-check for an
  official figure before re-proposing.
- PocketBase (~14/20,#29, near-miss): 60.8k★, single-binary/SQLite, no deps — real demand
  (10 GH issues on OOM/memory). No reachable official RAM figure (pocketbase.io blocked, no
  in-repo docs mirror). Re-check sourcing before re-scoring.
- Zitadel (13/20,#29): 14.8k★ IAM, crowds Keycloak (shipped). Sourced verbatim via in-repo
  docs mirror despite zitadel.com blocked (~512MB app / 4GB per DB core, Postgres≥14 req)
  — below bar on coverage/channel, not sourcing.
- Appwrite (9/20,#29): BaaS, no reachable figure, no in-repo mirror, overlaps Supabase
  (already queued). Weakest of the three.

## Unverified sub-detail
- Graylog (~8.1k★,#15): docs repo archived, docs.graylog.org presumed blocked — shallow.
- Parked, #13: Helm/K8s-chart column — nextcloud/helm's README disclaims official support
  despite living in-org — needs an official/unofficial rule.
- Budibase (#22): low-code internal-tool builder. Official self-host-specification page
  (budibase.com) domain-blocked from cloud sessions; only a recommended (not min) 4CPU/
  8GB/150GB figure found second-hand. Hold for a local-session fetch.
- Revolt/stoatchat chat (#22, ~2.3k★): org renamed revoltchat→stoatchat (alias-sweep flag).
  Deps Mongo+Redis+MinIO — MinIO unmapped in SERVICES enum (policy: data-quality SKILL.md),
  same shape as Ente/Sentry/PostHog. Hold for deps-schema, same as those.
- PocketBase (~14/20, #29): pocketbase/pocketbase, 60.8k★, single Go binary + embedded
  SQLite, deps:none. README has no RAM/CPU figure; pocketbase.io (official docs) returned
  EGRESS_BLOCKED from this session's network proxy both via the harvester and the independent
  verifier's own WebFetch attempt; GitHub code-search of the pocketbase org found no in-repo
  docs mirror (unlike Zitadel below) to fall back on. Real demand signal: verifier found ~10
  open GitHub issues on memory/OOM pain (e.g. "keeps running out of memory" on fly.io).
  Third-party figures ("under 30MB RAM", "256MB VPS") exist (1vps.com) but are inadmissible
  (source-or-silence — not an official source). Hold; re-attempt sourcing from an environment
  that can reach pocketbase.io before re-scoring — do not queue on third-party figures.
- Zitadel (13/20, #29): zitadel/zitadel, 14.8k★, IAM/SSO (Keycloak/Authentik-style),
  requires PostgreSQL ≥14 (README, confirmed). zitadel.com/docs and help.zitadel.com both
  EGRESS_BLOCKED, but the verifier found the docs are mirrored in-repo (Docusaurus monorepo,
  `apps/docs/content/self-hosting/manage/production.mdx`) and reachable via
  raw.githubusercontent.com — verbatim: "ZITADEL itself requires approximately 512MB of RAM
  and can operate with less than one CPU core. The database component... utilizes about one
  CPU core per 100 requests per second and 4GB of RAM per core... For a minimal high-
  availability setup, we recommend a cluster of 3 nodes, each with 4 CPU cores and 16GB of
  memory." (raw.githubusercontent.com/zitadel/zitadel/main branch, retrieved 2026-08-23).
  Sourceable and real, but scores below bar on coverage-value/channel-value — Keycloak
  already ships the identity-platform slot and the IAM space is crowded (Authentik also
  held #12-13). Hold, not a sourcing gap; revisit only if a differentiation angle emerges.
- Appwrite (9/20, #29): appwrite/appwrite, popular BaaS. README has no RAM/CPU figure;
  appwrite.io EGRESS_BLOCKED; code-search of the appwrite org found no in-repo docs mirror.
  Conceptually overlaps Supabase self-hosted (already queued, #11) as a BaaS entry — weakest
  of this batch's three candidates. Hold.
