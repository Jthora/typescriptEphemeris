# Abuse Guardrails

## Controls
- Rate limits per device/profile for LLM calls and invoice creation; cooldown UI.
- Content filters / prompt hardening where supported by provider.
- Detect/reject replay of unlock tokens (bind to device/time/expiry).
- Cap prompt size and output size to control costs and abuse.

## Cross-Integration
- Unlock token binding: [docs/payments/Client-Unlock-States.md](docs/payments/Client-Unlock-States.md).
- Prompt caps: [docs/ai/Prompt-Design.md](docs/ai/Prompt-Design.md) and [docs/ai/TOON-Serialization.md](docs/ai/TOON-Serialization.md).
- Rate-limit UX: [docs/calendar-ai/AI-Panel-UX.md](docs/calendar-ai/AI-Panel-UX.md).

## Footnotes
1. Apply rate limits per profile hash and per device to reduce sybil abuse.
