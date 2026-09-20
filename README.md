# Shift Rail Support

Static, bilingual support and privacy pages for Shift Rail.

## Local preview

Serve this directory over HTTP and open `/index.html`. The support documents are static; `/alarm-shift-demo.html` uses local JavaScript for an interactive time preview, with a static fallback. The site has no build step, analytics scripts, external fonts, or third-party runtime dependencies. The demo never schedules alarms or accesses Apple Clock.

## Published URLs

The canonical URLs assume a public GitHub Pages repository named `ppupy1209/shift-rail-support` served from its default branch root:

- `https://ppupy1209.github.io/shift-rail-support/`
- `https://ppupy1209.github.io/shift-rail-support/privacy.html`
- `https://ppupy1209.github.io/shift-rail-support/alarm-routine-guide.html`
- `https://ppupy1209.github.io/shift-rail-support/alarm-shift-demo.html`

Changes published from `main` must be verified at the affected URLs after GitHub Pages finishes deploying.

The alarm routine guide explains midnight weekday changes and the distinction between moving every saved entry and scheduling enabled entries. Both English and Korean examples are illustrative. Keep the public copy tied to the reviewed app source; do not enable purchase links or claim availability without a current matching App Store listing for the relevant country.

The interactive example uses the same minute/day arithmetic as `AlarmEntry.shifted(by:)` and `Weekday.shifted(by:)`, with the app's −60…+90 minute range. Its App Store links use the campaign URL created in App Store Connect for `sr_g01_demo_20260920`; there is no site-side click tracking. Campaign reporting can be unavailable below Apple's reporting threshold, so an absent report is not zero installs. Preserve the existing country-specific links on the support homepage.
