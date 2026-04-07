# melliHF Performance Site — TODOs

## Accessibility (HIGH)

- [ ] Add `role="img"` and `aria-label` to chart containers in EquityCurve.tsx and DrawdownChart.tsx — screen readers see nothing for the charts currently
- [ ] Add `aria-pressed` state to benchmark toggle buttons in EquityCurve.tsx
- [ ] Add accessible label to status dot in index.astro header
- [ ] Change root font-size to browser default (16px) and use `rem` units for component sizes — currently defeats user font-size preferences

## Design Tokens (MEDIUM)

- [ ] Extract hardcoded hex colors in EquityCurve.tsx and DrawdownChart.tsx to named constants matching CSS custom properties (lightweight-charts JS API can't read CSS vars, but constants should mirror the token names)
- [ ] Add `--warning`, `--warning-bg`, `--warning-border` tokens to global.css and use in DataFreshness.tsx (currently uses ad-hoc `#2a1f00`, `#5a4600`, `#fbbf24`)
- [ ] Audit remaining raw pixel values in inline styles (MetricsCards.tsx:130 `marginLeft: 4`, EquityCurve.tsx `gap: 16`) and replace with spacing tokens

## Architecture (MEDIUM)

- [ ] Migrate React component inline `style={{}}` objects to CSS modules or scoped stylesheets — enables hover states, proper responsive behavior, and future theming
- [ ] SystemStatus.tsx has no responsive handling for its 2-column grid — will overflow on narrow screens

## Polish (LOW)

- [ ] TradingView watermark links are 35x19px (below 44px touch target minimum) — third-party, may need CSS override or attribution placement change
- [ ] Pipeline card arrows in HowItWorks.astro lose flow clarity on mobile vertical layout

## Done (from /design-review 2026-04-07)

- [x] Fix lightweight-charts v5 API (`addLineSeries` → `addSeries(LineSeries)`)
- [x] Add semantic h1/h2 headings replacing div labels
- [x] Add "Performance" headline with return summary above equity curve
- [x] Add `color-scheme: dark` to html
- [x] Add `:focus-visible` styles globally
- [x] Reduce section spacing from 96px to 64px
- [x] Fix metric card animation reliability (IntersectionObserver fallback)
- [x] Fix mobile metrics grid with proper class-targeted breakpoints
