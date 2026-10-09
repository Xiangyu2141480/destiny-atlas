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

## Detailed readings and optional lookup (0.2)

`report.ts` orchestrates the original numerical engines, `interpretation/index.ts`, and explicit text mappings in `interpretation/profiles.ts`. The explanation layer returns JSON values and does not call a model or network. `PeriodExplorer` selects the month/year and advice focus; `PlainLanguageSummary` renders the overview. The CLI uses this exact orchestration and remains offline.

The optional UI-only adapter `services/onlinePlaces.ts` calls the fixed Open-Meteo geocoding endpoint. `OnlineCitySearch` sends only a city keyword after a deliberate action, cancels stale requests, times out after 8 seconds, and requires selection. Validated coordinates/timezone are mapped to `customPlace`; source/license metadata travels with the place and is marked modified if the user edits it. Nothing changes the curated offline gazetteer.

Schema version 1.1 adds yearly readings and explanations. There is no account system, API key storage, AI backend, automated browsing, or server component.
