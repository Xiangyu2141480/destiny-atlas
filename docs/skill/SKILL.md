---
name: destiny-atlas
description: Generate a deterministic, local-first Destiny Atlas JSON report from explicit birth data and MBTI self-identification.
---

# Destiny Atlas Skill

## Use

This skill validates an input JSON file and invokes the same `generateDestinyReport` engine used by the web UI:

```bash
npm run cli -- docs/skill/examples/input.json report.json
```

Omit the output path to write JSON to stdout. Input and output contracts are in `input-schema.json` and `output-schema.json`.

## Computed fields

- IANA-zone local time to UTC conversion
- life-path/personal-year/personal-month numbers
- deterministic birth/year tarot cards
- four Bazi pillars through `lunar-javascript`
- geocentric apparent ecliptic longitudes through `astronomy-engine`
- 24 monthly records

## Interpreted fields

MBTI descriptions, tarot keywords, themes, cross-system comparisons, and action prompts are rule-based symbolic interpretations. They are not measured traits or event forecasts.

## Error contract

The CLI exits `1` for missing arguments and `2` for invalid JSON, schema violations, unknown places, invalid/nonexistent local time, or engine errors. It never guesses a place, timezone, MBTI, or sex.

## Limits

See `../limitations.md`. Most importantly: no verified houses/ascendant, no Bazi luck cycles or strength judgment, monthly rather than exact transit search, and no scientific prediction claim.

## Schema 1.1 additions

The report also contains `explanation`, five `yearlyTimeline` records with four quarters each, and a `reading` on each monthly record. Text remains explicit local rule-based interpretation. An optional `customPlace.source` preserves attribution for UI-selected online locations; the CLI itself never performs lookup. The optional `now` argument controls the default month and year consistently.
