# SimpleAccess Homepage Recon & Design System Foundations

Verified on 2026-09-24 from `/Users/scott/code/local/simpleaccess/index.html` (commit `2b7cde6`, tag `v1.0.0`).

## 1. Color Palette & Contrast Ratios
- Primary Navy: `#002d62` (SimpleAccess Navy)
  - Contrast on `#ffffff`: 14.3:1 (WCAG AAA)
  - Contrast on `#f4f4f4`: 12.6:1 (WCAG AAA)
  - Contrast on Gold `#ffd700`: 9.5:1 (WCAG AAA)
- Accent Gold: `#ffd700` (SimpleAccess Brand Gold)
  - Contrast with `#002d62`: 9.5:1 (WCAG AAA)
- Text Body: `#1a1a1a` (Off-black)
  - Contrast on `#ffffff`: 17.6:1 (WCAG AAA)
  - Contrast on `#f4f4f4`: 15.5:1 (WCAG AAA)
- Canvas Background: `#f4f4f4`
- Surface Background: `#ffffff`
- Focus Indicator: `#d4af37` (Metallic Gold)
  - Outline: 4px solid `#d4af37`, offset 4px (`:focus-visible`)
  - Ensures SC 2.4.7 and SC 2.4.11/2.4.13 compliance
- Interactive Hover: `#004494` (Button hover blue)
- Validation Container: `#e8f0fe` (Light blue tinted box)
- Validation Table Header: `#d0def7` (Medium light blue)

## 2. Typography
- Main Font Family: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Monospace Font Family: `ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace`
- Body Line Height: 1.7
- Heading Line Height: 1.2
- Hierarchy:
  - Hero Title (`h1`): 3rem (desk), 2.25rem (mobile <= 768px), bold
  - Hero Description: 1.4rem (desk), 1.15rem (mobile)
  - Card Title (`h2`): 1.75rem
  - Manifesto text: 1.1rem, weight 500, italic

## 3. SMACSS Selectors on Homepage
- Base: `*`, `body`, `h1, h2, h3`, `code`, `img`, `:focus-visible`
- Layout:
  - `.l-header` (Navy bg, Gold bottom border 6px, padding 2rem 1rem)
  - `.l-nav` (White bg, sticky top 0, z-index 10, box-shadow)
  - `.l-main` (max-width 1100px, margin 0 auto 4rem auto, padding 0 1.5rem)
  - `.l-container` (max-width 900px, margin 0 auto)
  - `.l-grid` (grid auto-fit minmax(300px, 1fr), gap 2rem)
  - `.l-footer` (Navy bg, padding 4rem 1rem, margin-top 5rem)
- Module:
  - `.m-skip-link` (Position absolute offscreen, top 10px on focus)
  - `.m-nav-list` (Flex row wrap, gap 20px, list-style none)
  - `.m-nav-link` (Padding 8px 12px, hover/focus states)
  - `.m-manifesto` (Quote container)
  - `.m-hero`, `.m-hero__title`, `.m-hero__description`, `.m-hero__tagline`, `.m-hero__image`
  - `.m-card`, `.m-card__title`, `.m-card__text`
  - `.m-btn` (Inline block, padding 14px 28px, border-radius 4px)
  - `.m-test-suite`, `.m-table`
- State:
  - `:focus-visible`
  - Responsive breakpoint: `@media (max-width: 768px)`
