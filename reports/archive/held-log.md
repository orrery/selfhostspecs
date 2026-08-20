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
