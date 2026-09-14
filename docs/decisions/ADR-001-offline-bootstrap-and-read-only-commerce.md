# ADR-001 · Offline bootstrap and read-only commerce

Status: accepted for this source restoration scope; not production architecture approval.

Context: AI-agent baseline has a social publishing prototype, simulated production/QA and credential exposure. Pijama has a live-oriented protected commerce source. User needs complete reliable skill files before a builder agent starts implementation.

Decision: retain modular Node/CommonJS in AI-agent, with no third-party runtime dependencies; ESM snapshot script uses createRequire only for local JSON. Define full Company OS contracts and a deterministic offline toolkit. Remove supported live transport paths and block mutation at API/executor/CLI boundaries. Do not implement a half-secured signed approval or emulate media/payment success. Preserve legacy materials behind explicit quarantine.

Pijama stays read-only with pinned tree/source/API/product manifests. Do not vendor product code, duplicate commerce or dynamically import remote JS. Production source/identity/ledger/queue/transport choices need later ADRs and exact permission.

Consequences: previews/tests are reproducible without credentials; live marketing automation is intentionally unavailable until production controls exist. This is safer containment, not a claim the entire runtime is done. Archived binaries/history still need Owner security handling; documents alone cannot revoke provider credentials.
