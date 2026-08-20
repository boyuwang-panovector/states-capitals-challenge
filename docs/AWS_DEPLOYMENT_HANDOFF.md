# TrailTrek AWS Deployment Handoff

## Scope

This repository serves the public TrailTrek children’s U.S. states and capitals practice website. The intended production hostname is `learnusmap.captainflow.ai`. The application is static and does not process accounts, payments, medical information, or server-side user data. Test scores are stored only in the visitor’s browser.

## Deployment Boundary

TrailTrek must be deployed to an isolated release path and a dedicated web-server site configuration on the existing AWS environment. It must not modify or depend on another application’s process, deployment workflow, health check, data store, service account, port, or release history.

## Release Method

The repository is public. GitHub Actions must validate the exact source revision, build a reproducible static artifact, record a SHA-256 checksum, preserve the preceding release, and deploy only through an approved repository-specific AWS identity and server command path. Credentials, key material, tokens, and server addresses are deliberately excluded from this repository.

## Approval Gates

The deployment owner must approve any new billable AWS service, certificate request, public DNS change, or server configuration change before it is made. Before a DNS cutover, present the exact current and proposed DNS records, TTL, staging results, rollback target, and planned rollback window.

## Validation Standard

Before public DNS is changed, verify the static site through a controlled staging endpoint, including the landing page, study map, both 20-question quiz modes, name-and-score storage flow, responsive mobile layout, HTTPS configuration, error behavior, and browser console. Preserve the prior release until the agreed rollback window has expired.

## Placeholder Fields to Complete During Deployment

| Field | Value |
| --- | --- |
| AWS account and region | Confirmed out of band; do not store credentials here. |
| Runtime location | Dedicated static-release directory, pending approved host access. |
| Repository deployment identity | GitHub OIDC role restricted to this repository/environment, pending configuration. |
| Staging endpoint | Pending deployment preparation. |
| Production record | Pending owner review and explicit approval. |
| Rollback target | Previous immutable static release. |

## Deployment Record — 2026-08-20

TrailTrek’s static artifact from source commit `69b8cf9` was deployed to the isolated release path `/var/www/learnusmap.captainflow.ai/releases/69b8cf9`. The release archive SHA-256 is `cee9be068767bde04dadbbd9badba69c1f30ad9b05015e87aab176c3d435c45b`; the `current` symlink points to this release. The public hostname is `https://learnusmap.captainflow.ai`; Namecheap supplies an `A` record for `learnusmap` that points to `3.130.204.161`.

Let’s Encrypt TLS is active, HTTP redirects to HTTPS, and the certificate expires on 2026-11-18. The deployment uses the dedicated Nginx configuration `/etc/nginx/conf.d/learnusmap.captainflow.ai.conf` and a public-safe HTTP staging configuration committed as `2f78594`. Existing applications, services, ports, databases, and release directories were not modified.

To roll back this first release, remove the `learnusmap` DNS record if public service must be withdrawn, remove the dedicated Nginx configuration, reload Nginx, and remove `/var/www/learnusmap.captainflow.ai`. No legacy TrailTrek site existed before this release.

## Enhancement Release — Accurate Map and Learning Audio

The current release is source commit `9baa331`, deployed atomically from GitHub release `v2026.08.20-map-audio` to `/var/www/learnusmap.captainflow.ai/releases/9baa331/public`. Archive SHA-256: `6b1fcec20bc63102135ad41056b02b565a940432fd1d67c5651fadcacbbc8cfe`.

This release replaces the schematic pin layout with the included geographic U.S. state map and uses a deliberate opt-in Web Audio implementation for interactions, answer feedback, and one low-volume background loop. Sound must remain off by default until a learner clicks the sound control. Verification passed for the HTTPS home page and `/maps/us-states.json`; both returned HTTP 200 after the atomic switch. Roll back by repointing the `current` symlink to release `69b8cf9` and reloading Nginx.

## Atlas Repair Release — 2026-08-20

Source commit `f57184f` replaces the earlier map renderer with direct D3 SVG paths built from the Census-derived `us-atlas` topology. It adds capital markers from xFront coordinates and a 50-state discovery dataset with landmark imagery, photo credits, fact sources, and history notes. GitHub release `v2026.08.20-atlas-repair` archive SHA-256: `451c03511f5c398906d0f4181dc6a8e44c373504a748930b8bceb687205a344d`.

The release was first installed with `current` pointing to the `public` directory, which conflicted with the Nginx root of `/current/public` and caused an HTTP 500. The incident was corrected immediately by pointing `current` to `/var/www/learnusmap.captainflow.ai/releases/f57184f`. Secure local checks for the homepage and `/maps/us-states-10m.json` passed before Nginx reload; the public site then loaded the 50 interactive state paths.
