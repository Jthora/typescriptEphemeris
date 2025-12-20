# Key Management

## Guidelines
- Keep LLM/payment keys server-side when possible; expose only a thin proxy to clients.
- If client-only (last resort), warn about exposure; use env-based config for dev and limit scopes/quotas.
- Rotate keys regularly; avoid committing to repo; use env files ignored by VCS.
- Separate dev/stage/prod keys and endpoints.

## Cross-Integration
- Provider usage: [docs/ai/LLM-Providers.md](docs/ai/LLM-Providers.md).
- Payment flow secrets: [docs/payments/Security-and-Risk.md](docs/payments/Security-and-Risk.md).
- Proxy pattern references: [docs/architecture/System-Overview.md](docs/architecture/System-Overview.md).

## Footnotes
1. For client-visible configs, prefer short-lived tokens tied to origin and scope.
