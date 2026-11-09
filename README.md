# SHARE Service360 — Corporate GitHub Export

This branch holds the SHARE Service360 application for placement into its own dedicated folder in corporate GitHub.

## Layout
- `index.html`, `app.js`, `style.css` — app shell, login, styling and navigation
- `pages/`, `styles/` — Ambassador and management screens
- `data/` — programme and management reference data
- `services/` — user context, submissions and management actions

## Removed
- Four hardcoded QA agent modules and the entire `agents/` directory
- Fake AI analysis workflows, simulated orchestration, agent settings, analysis CTAs and fake AI result panels
- Cloudflare Workers-specific `wrangler.jsonc`
- User-visible "Prototype" labels

Existing performance cards, interaction records, Service Pulse analysis by group, Knowledge, Training, Ambassador workflows and management dashboards remain. Interaction details now display existing scores and suggested learning rather than pretending to perform an AI assessment.

## Corporate deployment
Copy this folder into its own corporate GitHub project path. Use the company's CI/CD and AWS container/EKS deployment configuration, not Cloudflare settings.

## Current implementation limitations
The application still has client-side test accounts, simulated SSO and browser localStorage for some records. It also does not yet implement the agreed invitation-based Ambassador onboarding. This packaging update does not change those behaviours or make the application production-ready.

Source: `krispradip/SHARELens` / corporate export branch; originates from main commit `f67e4e1dc01dcbe7f265529e2ff659eb0f33f47a`.
