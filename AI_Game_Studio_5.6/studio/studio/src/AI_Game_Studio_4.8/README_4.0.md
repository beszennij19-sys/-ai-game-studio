# AI Game Studio 4.0 — Unified AI Game Runtime

4.0 unifies the major generated systems into one runtime contract:

**Player + Camera + Controls + World + NPC + Quests + Inventory + Events + Save + HUD**

## Pipeline
Blueprint -> generated data -> unified runtime manifest -> Unity runtime -> final scene/build

## Project isolation
Runtime state is explicitly scoped by `ProjectID`. Save files are stored under:
`Application.persistentDataPath/AIStudio/<ProjectID>/runtime-save.json`

The JS runtime rejects loading state belonging to another project.

## Backend
- `POST /api/projects/:id/runtime/jobs`
- `GET /api/runtime-jobs/:jobId`

## Unity
Menu:
`AI Game Studio -> 4.0 -> Build Unified Runtime`

This creates the unified runtime root and bootstrap component. Existing generated modules still need their scene references wired by the Unity Editor.

## Important
4.0 is the unified runtime framework, not a claim that Unity has been executed or a store-ready game has been built in this environment. Final scene assembly, asset import, platform SDKs, signing and builds still require the Unity build environment.
