# SimpleAccess Design System

**A WCAG 2.2 AA Multi-Sensory Design System Built for Humans and Autonomous AI Agents**

---

## 1. Philosophy & Core Identity

The web is an inherently accessible, dynamic document medium first, and a visual canvas second. The **SimpleAccess Design System** (`simpleaccess-ds`) was created to unify https://simpleaccess.io/ under a clean, zero-bloat, standards-compliant architectural framework.

Most modern web frameworks bury standard HTML semantics beneath towering piles of runtime abstractions, virtual DOM trees, and vendor lock-in. SimpleAccess proves that the native web platform—empowered by modern W3C standards—already provides everything needed to build fast, resilient, beautiful, and deeply accessible digital experiences.

### Key Tenets
1. **View Source as Education:** The source markup of every page is an educational resource. Anyone inspecting elements in their browser should encounter clean, readable markup with crisp comments explaining *why* specific accessibility attributes, semantic elements, or ARIA roles were chosen.
2. **Lean & Dependency-Free:** Zero client-side JavaScript frameworks. Zero CSS preprocessors. We use native CSS Custom Properties, native Autonomous Custom Elements (Light DOM), and standards-based build tools.
3. **Universal Accessibility-First:** Compliance with WCAG 2.2 AA is foundational, never a retroactive bolt-on.

---

## 2. Multi-Sensory Delight: Sight, Sound, and Touch

Accessibility is too often framed purely as a checklist of restrictions. At SimpleAccess, accessibility is reimagined as **multi-sensory delight**—deliberately orchestrating visual, auditory, and tactile sensations to create a richer experience for everyone.

### Sight (Visual Harmony & Contrast)
- **High-Contrast Palette:** Deep Brand Navy (`#002d62`) against pure White (`#ffffff`) yields an exceptional **14.3:1** contrast ratio. Charcoal body text (`#1a1a1a`) achieves **17.6:1**, vastly exceeding WCAG AAA standards.
- **Unambiguous Focus Indicators:** A 3px solid Metallic Gold focus ring (`#d4af37`) with a 3px outline offset guarantees immediate keyboard orientation without visually crowding the control.
- **Adaptive Modes:** First-class support for `prefers-color-scheme: dark` and Windows High Contrast Mode (`forced-colors: active`).

### Sound (Acoustic Feedback & Screen Reader Semantics)
- **Semantic Landmark Clarity:** Standard landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) allow screen reader users to jump between page regions effortlessly.
- **Web Audio Earcons:** Subtle, pleasant acoustic tones (e.g. 440 Hz pure sine wave with smooth exponential decay) provide immediate auditory confirmation for interactive actions.
- **Respect for Cognitive Quiet:** Audio feedback automatically honors `prefers-reduced-motion` and provides user mute toggles.

### Touch (Tactile Ergonomics & Haptics)
- **Generous 44px Touch Targets:** All interactive controls maintain a minimum footprint of 44x44px (`--sys-touch-min-target`), exceeding WCAG 2.2 SC 2.5.8 (24px) to ensure effortless operation on touchscreens and for users with motor tremors.
- **Haptic Vibration:** Subtle tactile pulses (12ms) via the Web Haptic API (`navigator.vibrate`) give physical presence to digital taps on supported mobile devices.
- **Physical Spring Feedback:** Active states physically depress (`transform: scale(0.97)`) to simulate physical tactile resistance.

---

## 3. SMACSS CSS Architecture

We structure our CSS using Jonathan Snook’s **Scalable and Modular Architecture for CSS (SMACSS)** to eliminate specificity wars and keep styles decoupled:

1. **Base (`01-base/`):** Element selectors only. Box model resets, typography scales, default links, code blocks, and global `:focus-visible` styling. No class selectors allowed.
2. **Layout (`02-layout/`):** Major page wireframe regions prefixed with `.l-*` (`.l-header`, `.l-nav`, `.l-main`, `.l-container`, `.l-grid`, `.l-footer`).
3. **Module (`03-module/`):** Reusable, self-contained components prefixed with `.m-*` (`.m-hero`, `.m-card`, `.m-btn`, `.m-table`, `.m-badge`, `.m-manifesto`, `.m-demo`).
4. **State (`04-state/`):** Interactive conditions prefixed with `.is-*` (`.is-current`, `.is-active`, `.is-disabled`) and ARIA attribute selectors (`[aria-current="page"]`).
5. **Theme (`05-theme/`):** Media queries adapting colors and animations (`prefers-color-scheme`, `forced-colors`, `prefers-reduced-motion`).

---

## 4. Brad Frost Atomic Design Methodology

SimpleAccess organizes UI patterns according to Brad Frost's Atomic Design:

- **Atoms:** Design tokens, colors, typography scales, spacing units, and native HTML tags (`<button>`, `<input>`, `<a>`).
- **Molecules:** Functional combinations such as `.m-skip-link`, `.m-nav-list`, `.m-badge`, and `.m-btn`.
- **Organisms:** Complex UI sections such as `.m-hero`, `.l-grid` card collections, and `.m-test-suite`.
- **Templates:** Page blueprints located in `templates/` (`home.template.html`, `element.template.html`, `guide.template.html`, `lab.template.html`).
- **Pages:** Concrete HTML pages deployed across simpleaccess.io.

---

## 5. W3C Design Tokens Community Group (DTCG)

Our single source of truth for all design decisions is `tokens.json`, authored strictly to the **W3C DTCG 2025.10 Specification**:

```json
{
  "color": {
    "palette": {
      "navy": {
        "$value": "#002d62",
        "$type": "color",
        "$description": "Core primary brand color. Contrast ratio 14.3:1 against white."
      }
    }
  }
}
```

A lightweight native Node.js compiler (`scripts/build-tokens.mjs`) translates `tokens.json` into:
- `css/tokens.css`: Standard CSS custom properties scoped to `:root` and `@media (prefers-color-scheme: dark)`.
- `dist/tokens.js`: ESM JavaScript module exporting token objects for client scripts.

---

## 6. Autonomous Custom Elements (Light DOM)

We utilize the W3C Web Components standard (`customElements.define`) while deliberately choosing **Light DOM** over Shadow DOM:
- **Preserved Accessibility Tree:** Shadow DOM can create barriers for screen readers navigating semantic landmark hierarchies. Light DOM renders semantic `<header>`, `<nav>`, and `<footer>` elements directly into the main document tree.
- **Seamless Styling:** Custom elements inherit all global SMACSS styles and CSS custom properties without requiring shadow-piercing hacks or duplicate CSS imports.

Components included:
- `<ds-header>`: Renders `.l-header` banner with site title and tagline.
- `<ds-nav>`: Renders `.l-nav` navigation bar and automatically highlights the active link (`aria-current="page"`) based on `window.location.pathname`.
- `<ds-footer>`: Renders `.l-footer` with copyright and standards metadata.

---

## 7. Agentic AI Workflows & Conference Presentation Guide

SimpleAccess Design System is explicitly designed to be showcased at international software conferences as a gold standard for **Agentic AI Engineering**.

### Why Design Systems Are Essential for Agentic AI
Frontier AI models (such as Gemini 3.8 Flash, Claude 3.7 Sonnet, and GPT-4o) and local models (such as Gemma 4 31B Dense and 26B MoE) are extraordinarily capable programmers, but when tasked with modifying large web applications page-by-page, they suffer from **design drift**:
- Models invent slightly different hex codes on each page (`#002d60` vs `#002d62`).
- Models write conflicting CSS class names (`.btn-primary` vs `.main-button`).
- Models forget critical accessibility attributes when generating markup in isolation.

### The Agentic Solution: `llms.txt` + Deterministic Governance
By pairing a rigid W3C DTCG token structure with an `llms.txt` file (following the https://llmstxt.org/ standard):
1. **Context Window Efficiency:** Rather than ingesting thousands of lines of CSS, the AI agent reads `llms.txt` to grasp the complete design vocabulary in seconds.
2. **Zero Hallucination UI:** Agents are constrained to a fixed catalog of SMACSS classes (`.m-hero`, `.m-card`, `.m-btn`) and custom components (`<ds-header>`, `<ds-nav>`).
3. **Automated Verification:** The agent runs deterministic test suites (`npm test`) to verify contrast ratios, landmark presence, and skip links before committing code.

SimpleAccess demonstrates that the combination of clean web standards, structured CSS architecture, and autonomous AI agents produces software of unparalleled quality, accessibility, and speed.
