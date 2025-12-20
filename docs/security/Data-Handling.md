# Data Handling

## Principles
- Minimize PII; keep profile local.
- Do not send payment info or names to LLM unless explicitly required and consented.
- Redact unnecessary fields before network calls; send only the TOON payload + minimal profile fields.

## Practices
- Sanitization before prompt: strip HTML, trim strings, enforce length caps.
- Logging: avoid logging profile/prompt content; log only status codes and error categories.

## Cross-Integration
- Prompt content scope: [docs/ai/Prompt-Design.md](docs/ai/Prompt-Design.md).
- Key handling: [docs/security/Key-Management.md](docs/security/Key-Management.md).
- Abuse controls: [docs/security/Abuse-Guardrails.md](docs/security/Abuse-Guardrails.md).

## Footnotes
1. Apply sanitization both before sending to the LLM and before rendering responses.
