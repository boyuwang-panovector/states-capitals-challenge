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
