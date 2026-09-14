# Security posture and incident runbook

This release is OFFLINE ONLY. There is no live Meta, payment, email or CRM transport. Tests do not require credentials. Editing runtime flags does not authorize external actions.

## Known baseline incident

The original inspect_new_token.js and update_new_token.js scripts contained literal credentials. Replacements do not print or consume those credentials. Removing strings from HEAD does not revoke credentials and does not clean history, forks, clones, caches or packaged .skill files.

Owner action required: revoke/rotate affected credentials in the provider account; review account permissions, active sessions, scheduled content, campaigns and recent activity; reissue least-privilege identities only after containment; record redacted evidence. Do not paste tokens into an issue, prompt, workflow input or commit.

No history rewrite or archive deletion is performed here. Existing .skill binaries remain untrusted legacy and must not be installed until inspected safely; the supported entry points are the Markdown SKILL files in this repository.

## Reporting

Do not open a public issue containing credentials or customer data. Send the Owner a redacted incident summary through an already authorized private channel: affected service/path, timestamps, action taken, remaining exposure and evidence location. Do not test discovered credentials merely to assess validity.

## Controls and limitations

Static scans check current UTF-8 files for selected high-signal patterns; they are not a full secret detector or proof that history/binaries are clean. The toolkit has no secrets, signed approval service, production ledger, distributed locks or egress sandbox. Production requires independent service identities, key rotation, audit storage, data minimization and negative/integration tests described in the Company OS risk reference.

Emergency local stop does not cancel content scheduled on Meta or pause existing ads. Verify remote state through an authorized operator before claiming containment complete.

See [risk reference](ai-brand-company-os/references/10-risk-security-and-compliance.md) and [implementation status](docs/implementation/status.md).
