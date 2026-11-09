# SHARE Service360 — Corporate GitHub export

This is the complete SHARE Service360 web application source prepared from personal GitHub `krispradip/SHARELens`, `main` commit `f67e4e1dc01dcbe7f265529e2ff659eb0f33f47a`.

## Structure
- `index.html`, `app.js`, `style.css` — entry point and app shell
- `pages/`, `styles/` — Ambassador and management screens
- `data/`, `services/` — application data and workflow services
- `agents/` — existing JavaScript imports retained to avoid breaking the application; no external AI service or credential is included

Keep the relative paths intact when copying these files into their **own separate folder** in corporate GitHub.

## Hosting
The Cloudflare-specific `wrangler.jsonc` file is excluded. Corporate CI/CD, Docker/ECR/EKS, routing and ingress are configured separately using the existing corporate delivery workflow.

## Important
This export removes visible "prototype" wording but does **not** change application behaviour. The current browser login uses test credentials, Microsoft SSO is simulated, and submissions use browser localStorage. These must not be mistaken for enterprise security or durable data persistence. Replacing the text on screen does not enable SSO, connections, or backend storage.

Version: v0.12.0. Source commit: `f67e4e1dc01dcbe7f265529e2ff659eb0f33f47a`.
