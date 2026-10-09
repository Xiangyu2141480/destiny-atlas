# Architecture

The application is static-first. React is an adapter over framework-independent TypeScript engines.

```text
BirthInput
  ├─ place lookup → timezone/coordinates
  ├─ datetime → local/UTC/calculation time
  ├─ bazi / astronomy / numerology / tarot / personality
  └─ report orchestrator → 24 months → synthesis → DestinyReport JSON
                                      ├─ React report
                                      ├─ JSON download
                                      └─ CLI
```

`generateDestinyReport` is the only orchestration entry point used by both UI and CLI. Engines return plain typed values and do not access the DOM, storage, network, or React. Interpretation mappings are static rules and remain separate from astronomical/calendar calculations.

Runtime data flow is ephemeral: form state → in-memory report → optional user-triggered download/print. No persistence layer exists.

Deployment uses Vite's `VITE_BASE_PATH`; GitHub Actions sets it to `/<repository>/` to support project pages. The generated `dist/` is a static artifact.
