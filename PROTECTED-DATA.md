# Protected control-plane data

This policy applies to AI-agent. It does not replace pijama/PROTECTED-DATA.md.

Owner approval is required before changing live authorization scope, signer trust roots, production feature flags, money thresholds/envelopes, source-of-truth selections, evidence status, or external execution capabilities. Generic requests to optimize growth or fix tests do not authorize those changes.

Draft specifications and offline tests may be improved within the task scope, but must remain clearly marked non-authorizing. Do not fabricate Owner signatures, approvals, balances or evidence to fill null fields.

Never commit actual credentials, customer/order exports, financial statements or signing keys. Store sensitive evidence outside public Git with scoped access; use opaque references here.

The pijama catalog, price/stock validators, email configuration/templates, environment template and technical fabric data remain read-only unless Owner names exact files/fields to change. Snapshot fields do not override commerce policy.
