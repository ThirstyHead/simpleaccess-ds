# Multi-Sensory Specification: Sight, Sound, and Touch

SimpleAccess.io core thesis: "The Web is Sight, Sound, and Touch. Let's create a web that delights all of the senses."

## 1. Sight
- **Contrast Governance**:
  - Text to background: minimum 4.5:1 (WCAG AA), targeting AAA (7:1+ for primary reading text). Primary Navy on Off-white is 12.6:1.
  - Non-text contrast: minimum 3:1 for graphical objects, borders, and user interface components (WCAG 2.2 SC 1.4.11).
- **Focus Rings**:
  - High-visibility focus indicator: 4px solid `#d4af37` (Metallic Gold) with `4px outline-offset`.
  - Contrasts cleanly against both `#ffffff` / `#f4f4f4` backgrounds and `#002d62` navy interactive headers/buttons.
  - Strict `:focus-visible` to avoid unnecessary focus rings on mouse click while preserving instant keyboard indicator.
- **Theme Adaptability**:
  - Light mode (default): Navy and Gold on crisp light canvas.
  - Dark mode (`prefers-color-scheme: dark`): Deep Navy/Obsidian (`#0a192f`) canvas, luminous gold accents, off-white text.
  - Forced Colors mode (`forced-colors: active`): System-driven high contrast with 2px borders on cards and components.
- **Motion & Vestibular**:
  - Motion tokens with fallback to `prefers-reduced-motion: reduce` (disabling non-essential transforms/transitions).

## 2. Sound
- **Screen Reader UX**:
  - Strict semantic landmark hierarchy (`<header>`, `<nav aria-label="...">`, `<main id="main-content">`, `<footer class="l-footer">`).
  - No redundant "link" or "graphic" in accessible names.
  - `aria-current="page"` dynamically assigned on the active navigation link.
  - "Skip to main content" link as first focusable element on every page.
  - Screen reader announcement regions (`aria-live="polite"`) for interactive feedback.
- **Accessible Earcons (Web Audio API Synthesizer)**:
  - Zero heavy audio files; synthesized entirely in browser via a lightweight utility `ds-audio.js`.
  - Subtle acoustic confirmation tones (e.g. 440Hz warm sine pulse with soft decay, 50ms) for key interactions in Sensory Lab or action buttons.
  - Built-in user control: Earcons respect user preference (`prefers-reduced-motion` or muted toggle) and never autoplay.

## 3. Touch
- **Target Sizing**:
  - All interactive elements meet or exceed WCAG 2.2 SC 2.5.8 (Target Size Minimum: 24x24px) by standardizing on 44x44px minimum touch targets (`min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center;`).
  - Generous spacing around tap targets to eliminate accidental taps.
- **Tactile Feedback**:
  - Active button state provides visual tactile depression (`transform: translateY(1px)` or shadow compression).
  - Haptic feedback on supported mobile devices using the Web Vibration API (`navigator.vibrate([15])` short tactile tick) on button interactions in Sensory Lab.
