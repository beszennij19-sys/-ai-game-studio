# AI Game Studio 5.8 — Release Candidate

This is the feature-frozen release candidate for deployment.

## Final flow

Idea → AI Blueprint → Gameplay → World → Characters → Quests → Assets → Runtime → Director → Interactive Preview → Build/Export

## Validation

`node scripts/release-check-5.8.js`

The check validates:
- required release files;
- JSON syntax;
- JavaScript/MJS syntax with Node;
- no obvious placeholder secrets in tracked environment examples;
- project isolation markers in generated pipeline manifests when present.

## What 5.8 is

A deployable source package for the AI Game Studio web service and generation pipeline.

## What 5.8 is not

It is not itself a hosted public website and does not contain private API keys, cloud credentials, Unity licenses, Apple signing certificates, or Google Play signing keys.

Those are deployment-time configuration and secrets.
