# Facebook baseline audit

Baseline commit: 72e9c67ed4f62de697625e680771a139341e070a. Scope: repository text and entry points, no provider calls.

Known literal credentials in two token scripts: replaced with blocked helpers; Owner must revoke/rotate. AI pipeline had fixed SUCCESS/QA PASS/media paths without provider evidence: replaced by SHADOW/NOT_IMPLEMENTED/null. Direct publishing/scheduling paths: removed from supported runtime and hard-blocked.

Legacy brand/offer/model/claim configs are quarantined; existing reports and campaign documents are not current approvals. Packaged .skill binaries remain uninspected and are not supported installation sources. No binary/history cleanup or production claim is made.

Validation evidence is the exact-commit CI job log. Unit tests check forged approval/direct API paths remain blocked, no fake media/QA, source snapshot flags and CLI exits. They do not prove real Meta token health, image generation or live commerce reconciliation.
