# Security Docs

Data handling, key management, and abuse guardrails for AI and payments.

## Cross-Integration
- Data handling rules apply to prompts/responses: [docs/ai/Prompt-Design.md](docs/ai/Prompt-Design.md) and [docs/ai/Response-Handling.md](docs/ai/Response-Handling.md).
- Key management used by LLM/payment providers: [docs/security/Key-Management.md](docs/security/Key-Management.md).
- Abuse controls tie to rate limits and unlock tokens: [docs/security/Abuse-Guardrails.md](docs/security/Abuse-Guardrails.md) and [docs/payments/Client-Unlock-States.md](docs/payments/Client-Unlock-States.md).

## Footnotes
1. Revisit security posture whenever provider/payment choices change.

## What lives here
- Data handling/redaction rules.
- Key/secret management guidance.
- Abuse/rate-limit controls and token binding expectations.

## How to use
1) Adding new data to prompts → check Data-Handling and redaction guidance.
2) Swapping providers or payment flows → update Key-Management and Abuse-Guardrails accordingly.
3) Introducing new unlock/token flows → ensure binding/expiry rules are documented.

## Maintenance checklist
- Keep key handling aligned with deployment setup (dev/stage/prod).
- Periodically review abuse limits vs. provider quotas.
- Audit logs to ensure no PII or prompt contents are stored.
