# TrailTrek Incident and Rollback Guide

## Rollback Principle

Roll back by restoring the immediately preceding immutable static release through the approved repository-specific deployment workflow or server release switch. Do not overwrite the only known-good release and do not alter another application’s deployment.

## Verification After Rollback

Confirm that the production hostname serves the known-good TrailTrek release, the core learning flow loads, static assets resolve, HTTPS is valid, and the server has no related error spike.

## Incident Record

Record the incident time, affected URL, source revision, artifact checksum, deployment run, observed impact, rollback action, verification result, remaining risks, and owner follow-up. Never record passwords, secrets, temporary tokens, or personal student data.
