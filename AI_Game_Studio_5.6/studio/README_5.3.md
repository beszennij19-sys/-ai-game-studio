# AI Game Studio 5.3 — Real AI Blueprint

5.3 adds the real OpenAI-powered Blueprint stage to the unified web generation flow. A user's natural-language game idea is sent server-side to the OpenAI Responses API and returned as a validated structured Blueprint using Zod Structured Outputs.

## Run

1. Copy `env.example` to `.env`.
2. Set `OPENAI_API_KEY`.
3. Install dependencies from `studio/launch-5.2/package.json`.
4. Start with `npm start` from `studio/launch-5.2`.
5. Open the web studio and create a project.

If no API key is configured, the real AI Blueprint endpoint returns a clear configuration error; it does not pretend that a generated result came from AI.

## Flow

Idea → Project ID → OpenAI structured Blueprint → Unified Build → Preview.

The API key stays server-side. 5.3 does not claim to include paid OpenAI usage, Unity cloud credentials, or compiled mobile/desktop binaries.
