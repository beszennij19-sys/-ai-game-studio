# AI Game Studio 4.8 — Playable Web Preview

4.8 adds a real browser-playable preview generated from the project's Blueprint. The Web Preview is a procedural first-person game sandbox with desktop and mobile controls, HUD, health/coins, locations, quest text and interaction feedback.

## Flow
Idea → account → project → AI Blueprint → Play → Build

## Preview
Open `/preview.html?project=PROJECT-ID` after signing in. The preview fetches only the authenticated user's project.

Controls:
- Desktop: WASD / arrows + mouse/touch look; Space for interaction.
- Mobile: virtual joystick + right-side look zone + action button.

## Important scope
This is a functional Web Preview/runtime sandbox, not the final AAA-quality game and not a compiled iOS/Android/Windows build. The final game still uses the Unity/CI pipeline from earlier versions. 4.8's purpose is to let the creator immediately play and validate the generated concept in the browser.
