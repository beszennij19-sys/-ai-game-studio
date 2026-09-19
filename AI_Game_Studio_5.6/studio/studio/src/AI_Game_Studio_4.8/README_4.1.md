# AI Game Studio 4.1 — AI Game Director Runtime

4.1 adds an orchestration layer above the individual gameplay systems.

## Core chain
**Story -> Quest -> NPC -> Location -> Event -> Reward -> Consequence -> Story Branch**

The Director stores the current story node, active/completed quests, events, rewards and consequences. State is project-scoped.

## Added
- Director graph compiler
- Runtime story/quest/event orchestration
- Branch and consequence flags
- Reward hooks
- Project-isolated director snapshots
- Backend Director Jobs
- Unity Director component and trigger
- Binding manifest

## Backend
- `POST /api/projects/:id/director/jobs`
- `GET /api/director-jobs/:jobId`

## Unity
`AI Game Studio -> 4.1 -> Build AI Game Director`

This creates the Director runtime root. Generated data and scene references still need to be connected in Unity Editor.

## Important
4.1 is an orchestration/runtime layer. It does not claim that an autonomous AI agent is dynamically rewriting a live game at runtime. The generated graph is deterministic and inspectable, which keeps gameplay reproducible and project-isolated.
