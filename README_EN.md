# Destiny Atlas

> Explore Your Patterns. Navigate Your Future.

Destiny Atlas is a static, local-first, traceable cultural exploration tool. From an explicit birth date, local wall time, city, and self-selected MBTI type, it produces a foundational Bazi chart, real astronomical longitudes, deterministic tarot/numerology, a 24-month timeline, and a rule-based synthesis report.

## Features

- Historical IANA timezone/DST conversion and optional approximate true solar time
- Solar-term-based Four Pillars, hidden stems, Na Yin, zodiac, and raw visible-element counts
- Geocentric apparent ecliptic longitudes for ten bodies, tropical signs, and natal aspects
- Life path, personal years/months, deterministic birth and year cards
- Cautious descriptions for all 16 user-selected MBTI types
- Interactive 24-month timeline with practical prompts
- Visible methodology, source, degradation, and limitation notes
- Browser print/save-as-PDF, JSON export, and CLI using the same engine

No placeholder screenshot is committed. Run the app and capture the actual UI if project screenshots are needed.

## Stack

React 19, TypeScript, Vite, Zod, Luxon, lunar-javascript, Astronomy Engine, Vitest, and Testing Library. Core use requires no backend, account, AI, or API key.

## Getting started

```bash
git clone <your-fork-url>
cd destiny-atlas
npm install
npm run dev
```

Node.js 20+ is required. The public sample is prefilled: `2002-10-03 02:00 / Guangzhou / ENFJ`.

## Development and verification

```bash
npm run lint
npm run test
npm run build
npm run licenses
npm run cli -- docs/skill/examples/input.json report.json
```

See [develop.md](develop.md) and [architecture](docs/architecture.md). The CLI and React UI both call `src/engines/report.ts`; there is no duplicate implementation.

## Methodology and honest degradation

Astronomy Engine provides astronomical coordinates, lunar-javascript calculates the foundational Four Pillars under its solar-term conventions, and Luxon/platform Intl resolves IANA timezone rules. Numerology and tarot arithmetic are explicitly defined and tested in [algorithms](docs/algorithms.md).

Unverified capabilities are disabled rather than invented: no houses/ascendant/MC, no Bazi strength/useful-god/luck-pillar claims, and no claim that monthly transit snapshots are exact crossing searches. Read [limitations](docs/limitations.md).

## GitHub Pages

1. Fork the repository and set Settings → Pages → Source to **GitHub Actions**.
2. Push to `main`. CI runs install, lint, test, license, and build gates.
3. The workflow sets `VITE_BASE_PATH=/<repository>/`, so project pages do not assume a domain root.

For another static host, publish `dist/` after `npm run build`; set `VITE_BASE_PATH` if hosted below a subpath.

## Documentation

- [Development plan](develop.md)
- [Algorithms](docs/algorithms.md)
- [Architecture](docs/architecture.md)
- [Privacy](docs/privacy.md)
- [Limitations](docs/limitations.md)
- [Sources and licenses](docs/references.md)
- [CLI / Skill](docs/skill/SKILL.md)
- [中文 README](README.md)

## Roadmap and contributing

Planned work: auditable global offline places, more authority-backed boundary fixtures, exact transit searches, verified Whole Sign houses, and end-to-end print regression. Before contributing, run all four quality gates. New algorithms must document source, convention, input, intermediate values, and limitations; random confidence scores and unverified golden fixtures are not accepted.

## License and disclaimer

Project code is [MIT licensed](LICENSE). Direct production dependencies are MIT at the lockfile versions; run `npm run licenses` to verify recursively.

For cultural, entertainment, and self-reflection use only. Destiny Atlas does not scientifically predict fate and is not medical, psychological, legal, financial, or other professional advice. Personal input remains local by default; see [privacy](docs/privacy.md).

## 0.2: detailed readings, yearly view, and optional online lookup

Reports now include plain-language explanations, actionable advice in five areas, and a five-calendar-year view with quarterly plans alongside the existing 24 months. These are transparent cultural/reflection rules, not event forecasts. Schema `1.1` preserves prior fields and adds `explanation`, `yearlyTimeline`, and monthly `reading`.

Optional Open-Meteo/GeoNames lookup sends only the explicitly entered city keyword after a search click. Birth data and reports remain local. Results require selection before being applied; the offline gazetteer and manual coordinates remain available. Provider attribution and data-license metadata are retained in the report.

The geocoding provider's published README permits open-source/non-commercial use and declares API data CC BY-NC 4.0. Review provider terms before commercial deployment or replace the adapter. No AGPL server implementation is included; this project's code remains MIT. The CLI continues to operate offline.

## 0.3: summary and detailed reading modes

The default summary shows a few personal labels, the starting month's focus, three practical actions, and the starting year's reminder. Detailed mode retains all existing charts, periods, and methodology. Switch before generation or while reading; both modes reuse the same report without recalculation. Advice focus is shared, and detailed selections survive switching away and back. A summary-first session does not mount the chart or personality gallery.

Use `?view=summary` or `?view=detailed` to share a mode. No birth data is stored in the URL. Printing includes only the active mode; JSON export remains complete. Algorithms and report schema 1.1 are unchanged.
