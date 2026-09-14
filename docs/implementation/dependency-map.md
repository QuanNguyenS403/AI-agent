# Dependency map

```mermaid
flowchart TD
  M0["M0: containment"] --> M1["M1: truth + policy"]
  M1 --> M2["M2: governed publisher"]
  M1 --> M3["M3: commerce + finance"]
  M2 --> M4["M4: organic workflows"]
  M3 --> M4
  M3 --> M5["M5: owner dashboards"]
  M5 --> M6["M6: capital gate"]
  M4 --> M6
  M6 --> M7["M7: paid test"]
  E["Eval at every milestone"] -.-> M2
  E -.-> M6
```

Arrows are launch dependencies, not proof of completion. Organic planning/eval fixtures can run offline while production dependencies are blocked. Paid transport must not exist as an uncontrolled alternate path.

Cross-cutting controls: Owner policy, source/rights/consent, secrets/signers, schema validation, audit, durable idempotency/reservations and incident recovery. Missing safety boundary stops dependent external work but does not stop independent internal documentation/tests.
