# AI Game Studio 3.9 — AI Gameplay World

3.9 connects the generated world to gameplay systems.

## Pipeline
World -> NPC population -> resources -> quest triggers -> world events -> dynamic encounters -> progression -> save state -> Unity runtime

## Added
- Location gameplay bindings
- NPC schedules/reactions
- Quest triggers from location/NPC/resource/event
- Resource node hooks
- Ambient and location events
- Dynamic encounter table
- Runtime bindings for player/world/AI/progression
- Project-scoped gameplay-world jobs
- Unity runtime trigger component

## Project isolation
`Generated/<ProjectID>/GameplayWorld/<WorldID>/`

## Backend
- `POST /api/projects/:id/gameplay-worlds/:worldId/jobs`
- `GET /api/gameplay-world-jobs/:jobId`

## Unity
`AI Game Studio -> 3.9 -> Prepare Gameplay World`

The package provides the gameplay-world orchestration/runtime layer. Unity Editor is still required to import assets, wire scene references, configure colliders/navmesh and produce the final build.
