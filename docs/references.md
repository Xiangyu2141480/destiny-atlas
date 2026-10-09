# Sources and dependency licenses

## Computation references

- Astronomy Engine, Don Cross: <https://github.com/cosinekitty/astronomy> — MIT. Geocentric vectors and ecliptic conversion.
- lunar-javascript: <https://github.com/6tail/lunar-javascript> — MIT. Chinese calendar, solar terms, and Eight Characters API.
- Luxon: <https://github.com/moment/luxon> — MIT. IANA-zone conversion through platform Intl.
- Tarot year-card convention: Mary K. Greer–related tarot numerology is a design reference, but practices vary. This repository defines and tests its exact arithmetic in `docs/algorithms.md` rather than claiming a universal method.
- MBTI is used as a user-selected descriptive framework. “Myers-Briggs Type Indicator” and MBTI are marks of The Myers-Briggs Company; this project is not affiliated and does not administer the official instrument.

## License policy

Project code is MIT. Direct production dependencies are MIT at the versions recorded in `package-lock.json`. Swiss Ephemeris is deliberately not included because its AGPL/commercial dual licensing does not match this MVP's chosen dependency policy.

Run:

```bash
npm run licenses
```

The command recursively rejects production dependency licenses outside the allow-list. Package metadata can be imperfect; redistributors should also inspect package license texts and the generated lockfile before release.
