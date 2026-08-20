# TrailTrek Repository Guide

TrailTrek is a public, static React learning game for children practicing U.S. states, capitals, and locations. It includes a study map, a multiple-choice quiz, a fill-in challenge, and device-local score history.

## Safe Commands

Run `pnpm check` for TypeScript validation and `pnpm build` for a production build. Do not commit `node_modules/`, compiled `dist/` output, local logs, credentials, certificates, session tokens, or server configuration files containing secrets.

## Deployment Rules

This repository must use a dedicated AWS deployment configuration and an isolated server release location. Do not reuse, modify, or deploy through any workflow, service, port, web root, or release directory belonging to another application. A public DNS change for `learnusmap.captainflow.ai` requires the owner’s explicit approval in the same session after the exact proposed record, TTL, staging evidence, and rollback record have been presented.

## Supporting Records

Read `docs/AWS_DEPLOYMENT_HANDOFF.md`, `docs/DEPLOYMENT_CHECKLIST.md`, and `docs/INCIDENT_AND_ROLLBACK.md` before preparing a release. These documents record only non-secret operational information.
