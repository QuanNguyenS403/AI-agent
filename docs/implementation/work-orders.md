# Implementation Work Orders

These are proposed backlog records, not fabricated completed executions. Each needs an issued WO and exact authorization before external work.

| ID | Owner role | Dependencies | Acceptance / safe scope |
|---|---|---|---|
| WO-M0-CONTAIN | Governance + Owner | None | Current text no literal credentials; all supported mutation commands blocked; Owner rotation receipt and archive review pending |
| WO-M1-TRUTH | Product + Governance | M0 | Versioned SKU/claim/service/rights records, conflicts resolved by Owner, expiry/revocation tests |
| WO-M1-SIGNER | Governance | M0 | Isolated signer identities, canonical digest binding, no self-sign, nonce/revocation tests |
| WO-M2-QUEUE | CEO engineering | M1 | Durable CAS lease/outbox/unique idempotency, crash/replay/race tests; no live API in unit tests |
| WO-M2-PUBLISHER | Social + Governance | M1/M2 queue | Exact Page/IG mode permission, immutable artifact, QA/approval recheck, reconciliation; Owner-authorized staging only |
| WO-M3-COMMERCE | Conversion | M1 + source permission | Read-only minimized adapter; no protected writes; payment state evidence and dedup tests |
| WO-M3-FINANCE | Finance | M3 commerce | Balanced append-only ledger, refunds/COGS/cost, source reconciliation, reserve/unknown tests |
| WO-M4-ORGANIC | CEO + departments | M2/M3 launch-ready | Small supervised portfolio, actual media/rights/QA, support capacity, measured learning |
| WO-M5-DASHBOARDS | CEO engineering | M3 | Exactly three owner entry points; source freshness/unknown states; auth tests |
| WO-M6-GATE | Finance + Governance | M3/M5 | Runtime G0–G6, independent signed receipt/envelope, atomic reservations and expiry/revoke tests |
| WO-M7-PAID | Paid + Finance | M6 + exact Owner permission | Dry-run first; finite approved micro-test, verified stop-loss/pause; no autonomous scale |
| WO-M8-EVAL | Governance + QA | Every milestone | Role-specific adversarial/holdout/shadow results, independent scoped promotion and demotion |

For every WO record cost limit, environment, inputs/digests, acceptance, deadline, reviewer and rollback. Missing Owner choice leaves it BLOCKED; independent draft/test work may continue. No issue/WO state in this document is an authorization to contact a customer/provider.
