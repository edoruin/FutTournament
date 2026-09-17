---
name: Athletic Tournament System
colors:
  surface: '#faf8ff'
  surface-dim: '#d7d9e8'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#ebedfc'
  surface-container-high: '#e5e7f6'
  surface-container-highest: '#dfe2f1'
  on-surface: '#171b26'
  on-surface-variant: '#434655'
  inverse-surface: '#2c303b'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#623c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#825100'
  on-tertiary-container: '#ffcb8f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#171b26'
  surface-variant: '#dfe2f1'
typography:
  display-hero:
    fontFamily: Chivo
    fontSize: 56px
    fontWeight: '900'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Chivo
    fontSize: 36px
    fontWeight: '900'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chivo
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  scoreboard-num:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 48px
    letterSpacing: -0.04em
  body-lg:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Chivo
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Chivo
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Chivo
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Chivo
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-xs:
    fontFamily: Chivo
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system delivers an electric, high-stakes tournament atmosphere rooted in competitive discipline, tactical clarity, and athletic precision. Designed for players, coaches, scouts, and tournament directors, the UI emphasizes instant scannability, real-time match dynamics, and unmistakable typographic hierarchy.

Drawing from modern high-contrast athletic graphics and clean geometric structuring, the aesthetic combines an absolute dark command frame (header, global navigation, and terminal footer) with an ultra-crisp, bright white arena canvas. The layout relies on structural gridlines, vibrant typography, and vivid status-driven accents rather than raster photography or heavy illustrative assets, ensuring pristine performance and immediate comprehension under intense match-day conditions.

## Colors
The color architecture relies on a specialized division between command structural anchors, reading canvases, and functional athletic accents:

- **Command Frames & Anchors:** Jet black (`#0b0f19`) anchors the global navigation, utility bars, and master footer, framing the application with executive weight.
- **Canvas & Surfaces:** The active match field is clean, pure solid white (`#ffffff`), paired with crisp structural boundary lines (`#e2e8f0`) and subtle slate backings (`#f8fafc`).
- **Typography & Display:** High-contrast tactical deep blues:
  - Primary text & headlines: `#0f172a` (Night Slate) and `#1e40af` (Deep Royal Navy).
  - Highlighting & display numerals: Vibrant Royal Blue (`#1d4ed8`).
- **Athletic Accent Palette:**
  - Emerald Green (`#059669` / `#10b981`): Active matches, confirmed advancement, victorious status, confirmation actions.
  - Vibrant Amber/Orange (`#d97706` / `#f59e0b`): Penalties, pending reviews, tournament warnings, tiebreak states.
  - Electric Blue (`#2563eb` / `#38bdf8`): Primary CTAs, match schedules, informational banners.
  - Crimson / Coral (`#dc2626` / `#ef4444`): Eliminations, red cards, live recording pulses, critical alerts.
  - Royal Purple (`#7c3aed` / `#8b5cf6`): MVP honors, playoff bracket highlights, championship tiers.

## Typography
Chivo drives the entire typographic spectrum, providing raw athletic speed, crisp mechanical proportions, and assertive legibility at every scale. 

- **Display & Numerical Elements:** Heavy weights (800 and 900) are reserved for match scores, brackets, standings seeds, and hero banners. Scores utilize tight character spacing (`-0.04em`) to simulate digital stadium readouts.
- **Labels & Micro-Data:** Metadata, division tags, timestamps, and live match minutes use uppercase variants with wide letter tracking (`0.04em` to `0.08em`) to guarantee quick glances in fast-moving sideline conditions.
- **Editorial & Analysis:** Body weights remain at regular (400) or medium (500) to keep match commentary, official notes, and rule sets accessible and uncluttered.

## Layout & Spacing
The layout follows a precise 12-column modular grid designed for real-time tournament structures, standings tables, and matchup trees.

- **Desktop (1024px+):** 12-column configuration with a fixed max-width container of 1440px, 3rem margins, and 2rem gutters. Supports split-pane live tracking: match bracket on the left, running live telemetry/feed on the right.
- **Tablet (768px - 1023px):** 8-column layout with 2rem margins and 1.25rem gutters. Brackets and tables switch to horizontal smooth-swipe containers with clear indicator pins.
- **Mobile (Below 768px):** 4-column layout with 1rem margins and 1rem gutters. Scores collapse into consolidated match cards with stacked team rows.

Spacing follows an athletic 4px/8px incremental rhythm, pairing high density for statistics and telemetry with expansive vertical breathing space between distinct tournament stages.

## Elevation & Depth
Depth in this design system avoids heavy shadows, instead employing high-contrast boundary definition and crisp athletic elevation tiers.

- **Level 0 (Flat Arena Base):** Pure white canvas (`#ffffff`) used for the primary background. Content sections separate via 1px border lines (`#e2e8f0`).
- **Level 1 (Card & Bracket Nodes):** White surfaces elevated by a sharp 1px border (`#e2e8f0`) backed by a clean micro-shadow: `0 1px 3px 0 rgba(11, 15, 25, 0.06), 0 1px 2px -1px rgba(11, 15, 25, 0.04)`.
- **Level 2 (Active/Hover Nodes & Match Highlights):** Boundary changes to an electric primary tint (`#1d4ed8` or `#059669` depending on context) supported by an offset physical elevation: `0 4px 6px -1px rgba(11, 15, 25, 0.08), 0 2px 4px -2px rgba(11, 15, 25, 0.06)`.
- **Level 3 (Modals, Roster Flyouts, Tactical Drawers):** Supported by a solid 1px dark-tinted edge (`#cbd5e1`) and deep command shadowing: `0 20px 25px -5px rgba(11, 15, 25, 0.15), 0 8px 10px -6px rgba(11, 15, 25, 0.1)`.
- **Command Shell:** Global dark headers and footers use no elevation shadows, creating a razor-sharp structural frame directly abutting the white canvas.

## Shapes
The shape language is aerodynamic and athletic, anchored by tight, purposeful corners (Level 1: 0.25rem / 4px). This soft-chamfered discipline reflects high-tech precision equipment, running tracks, and digital tournament boards:

- **Buttons, Field Inputs, Badges:** Use crisp 4px corners (`rounded`) for a decisive, impact-ready profile.
- **Containers, Brackets, Scoreboard Panels:** Employ 8px corners (`rounded-lg`) to preserve modular structure across sprawling table data.
- **Live Status Pills & Round Indicators:** Full pill geometry (`rounded-full`) is reserved solely for match state indicators (e.g., `LIVE`, `FINAL`, `HALFTIME`) and numerical seed counters to create immediate visual distinction from rectangular structural blocks.

## Components

### Buttons & Interactive Controls
- **Primary CTA:** High-voltage royal blue background (`#1d4ed8`), crisp white bold label, 4px border radius. Hover transitions to `#1e40af` with a 1px upward translation.
- **Tournament Action Buttons:** Uses functional colors mapped to competitive states: Emerald Green (`#059669`) for match confirmation / check-in; Coral Crimson (`#dc2626`) for forfeit / protest actions.
- **Secondary / Ghost:** Solid white fill, 1px border in `#e2e8f0`, navy text (`#0f172a`), hovering into a subtle cool slate surface (`#f8fafc`) with a `#1d4ed8` border highlight.

### Chips & Status Badges
- **Structure:** Tight padding (2px vertical, 8px horizontal), bold uppercase 10px Chivo typography.
- **Live Match Chip:** Coral Crimson fill (`#ef4444`) with white typography and a rhythmic pulsing dot.
- **Division / Stage Chip:** Jet black outline or fill with high-contrast white text for tournament tier clarity (`GROUP STAGE`, `QUARTERFINAL`).
- **Advancement Chip:** Emerald Green light tint background (`#ecfdf5`) with solid emerald text (`#047857`) and a 1px emerald border.

### Match Cards & Tournament Brackets
- **Card Matrix:** Two-tier vertical split. White background with a 1px boundary (`#e2e8f0`).
- **Team Row:** Team monogram icon, bold navy typography (`#0f172a`), seed badge, and monospaced score box.
- **Active Node State:** The winning team row features high-contrast `#1e40af` typography and an emerald marker strip on the right boundary edge.

### Inputs & Search Fields
- **Container:** Pure white fill, 1px border (`#e2e8f0`), 4px border radius.
- **Focus State:** 2px solid Electric Blue outline (`#1d4ed8`) with zero blur halo, reinforcing tactical clarity.
- **Text & Placeholder:** Input text displays in deep night slate (`#0f172a`), with placeholders styled in balanced cool gray (`#94a3b8`).

### Standings Tables & Lists
- **Header:** Slate-shaded strip (`#f8fafc`) with 1px border top and bottom (`#e2e8f0`), uppercase tracking on all category columns (MP, W, D, L, GD, PTS).
- **Row Styling:** Alternating hover highlight (`#f1f5f9`), solid white default, separated by ultra-light dividers. Primary points (`PTS`) rendered in bold Royal Blue (`#1d4ed8`).