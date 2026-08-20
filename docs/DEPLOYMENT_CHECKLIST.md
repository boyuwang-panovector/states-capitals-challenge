# TrailTrek Deployment Checklist

## Preflight

- [ ] Repository source contains no secrets, tokens, or private server settings.
- [ ] `pnpm check` and `pnpm build` pass for the selected source revision.
- [ ] The release artifact checksum is recorded.
- [ ] An isolated static-release path and dedicated web-server configuration have been approved.
- [ ] The prior production release is identified and recoverable.

## Staging

- [ ] GitHub Actions validates the exact commit and preserves the artifact.
- [ ] The staged home page returns the expected response.
- [ ] The state study map, both test modes, score dialog, and local Trail Board work.
- [ ] The primary learning flow works at a mobile viewport.
- [ ] TLS, redirects, static asset caching, and server logs are checked.

## Cutover

- [ ] The owner reviews the exact current and proposed DNS records and TTL.
- [ ] The owner explicitly approves the public DNS change in the same session.
- [ ] Public hostname, HTTPS, mobile behavior, and console errors are checked after propagation.

## Rollback

- [ ] Prior static release location is documented before cutover.
- [ ] Rollback command or workflow path is tested without changing public DNS.
- [ ] The failed release is retained until cause and resolution are recorded.
