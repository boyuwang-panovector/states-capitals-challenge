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
