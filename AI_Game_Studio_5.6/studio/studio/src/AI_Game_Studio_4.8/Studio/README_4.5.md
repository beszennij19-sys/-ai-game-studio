# AI Game Studio 4.5 — Web Studio

4.5 turns the 4.4 web layer into a phone-first Studio workspace.

## Added
- Studio session/user ID stored in browser localStorage.
- Project ownership isolation through `X-Studio-User`.
- Server-side project list and project detail.
- Project status and build history records.
- Phone-first Studio UI: account, My Projects, project workspace, Blueprint generation, Complete Build and 10-stage progress.
- OpenAI generation when `OPENAI_API_KEY` is configured; deterministic fallback otherwise.
- Existing 4.2/4.3/4.4 pipeline remains included.

## Important
This is a working self-hosted web studio package. It is **not yet a publicly hosted SaaS** and the session is not production authentication. A production deployment needs HTTPS, real auth, persistent cloud DB/object storage and a queue/worker system.

## Run
```bash
cd Studio/backend
npm install
npm start
```
Then open the shown local URL. On an iPhone, the same UI can be opened through a deployed HTTPS server or local-network address.
