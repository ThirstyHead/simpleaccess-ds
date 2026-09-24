# SimpleAccess Design System Creation Plan

Plan Prefix: `2026-09-24_105146-design-system-creation`
Location: `/Users/scott/code/local/simpleaccess-ds`
Target Implementer: Gemini-3.8-flash (or Hermes Agent)

---

## 0. How to Resume After Context Loss

1. Read this plan file completely: `.hermes/plans/2026-09-24_105146-design-system-creation.md`.
2. Read the resume state file: `.hermes/plans/2026-09-24_105146-design-system-creation-RESUME.md`.
3. Read the progress log: `.hermes/plans/2026-09-24_105146-design-system-creation-PROGRESS.md`.
4. Run the state probe commands listed in `RESUME.md`.
5. **STOP-AND-ASK RULE**: If any state probe command contradicts what is recorded in `RESUME.md`, do not guess. Stop immediately, document the discrepancy, and ask the user for guidance.

---

## 1. Write-Out & Resume Protocol

For every task in Section 7:
1. Create and checkout the specified branch: `git checkout -b <branch-name>`.
2. Execute the task steps, writing files and tests exactly as specified.
3. Run the automated tests / linters to confirm GREEN state.
4. Append an entry to `.hermes/plans/2026-09-24_105146-design-system-creation-PROGRESS.md` with:
   - Date, Task Index & Name
   - Branch name, commit SHA
   - Test results (exact red/green split)
5. Rewrite `.hermes/plans/2026-09-24_105146-design-system-creation-RESUME.md` whole:
   - Current task index
   - Last completed step and base HEAD
   - State-probe block with expected outputs
   - Next exact command
6. Commit the task and bookkeeping: `git commit -am "<task-commit-message>"`.
7. Request user approval before proceeding to the next task / merging branch into `main`.

---

## 2. Goal

Extract and engineer a world-class, multi-sensory, WCAG 2.2 AA compliant design system in `/Users/scott/code/local/simpleaccess-ds` based on the homepage of `https://simpleaccess.io/`.

The design system must strictly conform to:
- **SMACSS** (Base, Layout, Module, State, Theme)
- **Atomic Design** (Atoms, Molecules, Organisms, Templates, Pages)
- **W3C Design Tokens Community Group Specification (DTCG 2025.10)** (`tokens.json`)
- **llms.txt & llms-full.txt** (Machine-readable blueprints for agentic AI consumption)
- **Multi-sensory delight**: Sight (high-contrast, dark mode, visible focus), Sound (screen readers + lightweight Web Audio earcons), Touch (44x44px minimum tap targets, active states, Web Haptics).
- **Conference Presentation Ready**: Educational "View Source" comments, clear architectural principles, designed to teach how agentic AI workflows thrive with structured design systems.

---

## 3. Current Context & Verified Facts

- Repository root: `/Users/scott/code/local/simpleaccess-ds`
  - Re-verify: `git -C /Users/scott/code/local/simpleaccess-ds status` (Expect: On branch main, clean)
- Source site homepage: `/Users/scott/code/local/simpleaccess/index.html` (Commit `2b7cde6`, Tag `v1.0.0`)
  - Re-verify: `git -C /Users/scott/code/local/simpleaccess describe --tags` (Expect: `v1.0.0`)
- Extracted Core Palette:
  - SimpleAccess Navy: `#002d62` (14.3:1 contrast on white, 12.6:1 on `#f4f4f4`)
  - SimpleAccess Gold: `#ffd700` (9.5:1 contrast against navy)
  - Text Main: `#1a1a1a` (17.6:1 contrast on white)
  - Canvas BG: `#f4f4f4`
  - Focus Ring: `#d4af37` (4px solid, 4px offset)
  - Hover Blue: `#004494`
- Node.js runtime available for test scripts: Node.js native test runner (`node --test`).

---

## 4. Architecture

The design system is split cleanly into three tiers:
1. **Machine-Readable Tier**: DTCG `tokens.json` compiled via vanilla Node script `scripts/build-tokens.mjs` into `css/tokens.css` and `dist/tokens.json`. Root `llms.txt` and `llms-full.txt` provide instant structured context for AI agents.
2. **Styling & Semantics Tier (SMACSS & Atomic)**: Modular CSS split across `01-base/`, `02-layout/`, `03-module/`, `04-state/`, and `05-theme/`, bundled into `dist/simpleaccess.css`. Native W3C Web Components (`ds-header`, `ds-nav`, `ds-footer`, `ds-sensory`) encapsulate shared landmarks while preserving Light DOM semantics.
3. **Multi-Sensory & Educational Tier**: Synthesized earcons via Web Audio API, haptic feedback via Web Vibration API, and educational "View Source" comments explaining WCAG 2.2 criteria on every component.

---

## 5. Project-Specific Design Sources

### 5.1 DTCG Token Schema (tokens.json)
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "palette": {
      "navy": { "$value": "#002d62", "$type": "color", "$description": "Primary SimpleAccess Navy" },
      "navy_hover": { "$value": "#004494", "$type": "color" },
      "navy_dark": { "$value": "#0a192f", "$type": "color" },
      "gold": { "$value": "#ffd700", "$type": "color", "$description": "Brand Gold Accent" },
      "gold_metallic": { "$value": "#d4af37", "$type": "color", "$description": "High-contrast Focus Ring Gold" },
      "charcoal": { "$value": "#1a1a1a", "$type": "color", "$description": "Primary body text" },
      "canvas": { "$value": "#f4f4f4", "$type": "color", "$description": "Page canvas light background" },
      "white": { "$value": "#ffffff", "$type": "color" },
      "blue_soft": { "$value": "#e8f0fe", "$type": "color" },
      "blue_header": { "$value": "#d0def7", "$type": "color" }
    },
    "sys": {
      "bg": {
        "canvas": { "$value": "{color.palette.canvas}", "$type": "color" },
        "surface": { "$value": "{color.palette.white}", "$type": "color" },
        "container": { "$value": "{color.palette.blue_soft}", "$type": "color" }
      },
      "text": {
        "main": { "$value": "{color.palette.charcoal}", "$type": "color" },
        "inverse": { "$value": "{color.palette.white}", "$type": "color" },
        "accent": { "$value": "{color.palette.navy}", "$type": "color" }
      },
      "interactive": {
        "primary": { "$value": "{color.palette.navy}", "$type": "color" },
        "hover": { "$value": "{color.palette.navy_hover}", "$type": "color" },
        "focus": { "$value": "{color.palette.gold_metallic}", "$type": "color" }
      }
    }
  },
  "spacing": {
    "scale": {
      "xs": { "$value": "0.25rem", "$type": "dimension" },
      "sm": { "$value": "0.5rem", "$type": "dimension" },
      "md": { "$value": "1rem", "$type": "dimension" },
      "lg": { "$value": "1.5rem", "$type": "dimension" },
      "xl": { "$value": "2rem", "$type": "dimension" },
      "xxl": { "$value": "3rem", "$type": "dimension" },
      "huge": { "$value": "5rem", "$type": "dimension" }
    }
  },
  "touch": {
    "target_min": { "$value": "44px", "$type": "dimension", "$description": "Exceeds WCAG 2.2 SC 2.5.8 24px" }
  },
  "sensory": {
    "earcon": {
      "activate_freq": { "$value": 440, "$type": "number", "$description": "Hz warm sine wave" },
      "activate_duration": { "$value": 0.05, "$type": "number", "$description": "seconds" }
    },
    "haptic": {
      "tap_pattern": { "$value": "[12]", "$type": "string", "$description": "ms vibration pattern" }
    }
  }
}
```

---

## 6. Test Suite / Validator (Written First)

Before writing component styles, create `tests/tokens.test.mjs` using Node's native test runner (`node --test`):
- Validates `tokens.json` schema matches DTCG format (`$value`, `$type`).
- Computes WCAG 2.2 contrast ratios programmatically for all semantic color pairs (ensuring text/canvas >= 4.5:1, interactive focus >= 3:1).
- Verifies that `dist/simpleaccess.css` exports all required SMACSS classes.

Command to run:
`node --test tests/tokens.test.mjs`

---

## 7. Step-by-Step Tasks

### Task 1: Initialize Package & W3C DTCG Design Tokens
- **Branch**: `feat/tokens-and-compiler`
- **Actions**:
  1. Create `package.json` with ESM type, build scripts (`npm run build`), test scripts (`node --test tests/*.test.mjs`).
  2. Create `tokens.json` strictly adhering to W3C DTCG 2025.10.
  3. Create `scripts/build-tokens.mjs` (vanilla Node script without heavy dependencies) to parse `tokens.json` and generate `css/tokens.css`.
  4. Write `tests/tokens.test.mjs` to validate schema and contrast math.
- **Verification Commands**:
  - `node scripts/build-tokens.mjs`
  - `node --test tests/tokens.test.mjs`
- **Expected Output**: Exit code 0, all tests pass, `css/tokens.css` generated.
- **Bookkeeping**: Append PROGRESS log, rewrite RESUME, commit `feat: add DTCG design tokens and compiler`.

### Task 2: Implement SMACSS CSS Architecture
- **Branch**: `feat/smacss-styles`
- **Actions**:
  1. `css/01-base/base.css`: Reset, HTML typography, code blocks, responsive images, `:focus-visible` rules with `--sys-interactive-focus`.
  2. `css/02-layout/layout.css`: `.l-header`, `.l-nav`, `.l-main`, `.l-container`, `.l-grid`, `.l-footer`.
  3. `css/03-module/module.css`: `.m-skip-link`, `.m-nav-list`, `.m-nav-link`, `.m-manifesto`, `.m-hero`, `.m-card`, `.m-btn`, `.m-test-suite`, `.m-table`, `.m-badge`, `.m-ref-link`.
  4. `css/04-state/state.css`: Active/current states (`.is-active`, `.is-current`), media queries (desktop/mobile layout switches).
  5. `css/05-theme/theme.css`: `@media (prefers-color-scheme: dark)`, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`.
  6. `css/simpleaccess.css`: Standard `@import` aggregation bundle.
  7. Add CSS validation test in `tests/css-smacss.test.mjs`.
- **Verification Commands**:
  - `node --test tests/css-smacss.test.mjs`
- **Expected Output**: Exit 0, all SMACSS class assertions pass.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `feat: implement SMACSS CSS architecture`.

### Task 3: Multi-Sensory Native Web Components
- **Branch**: `feat/web-components-multisensory`
- **Actions**:
  1. `components/ds-header.js`: `<ds-header>` custom element rendering accessible banner and manifesto.
  2. `components/ds-nav.js`: `<ds-nav>` custom element rendering sticky navigation bar with automated `aria-current="page"` resolution based on `window.location.pathname`.
  3. `components/ds-footer.js`: `<ds-footer>` custom element rendering semantic footer with copyright and making-of/testing links.
  4. `components/ds-sensory.js`: Multi-sensory helper providing Web Audio earcons (`playAccessibleTone()`) and haptic tick (`triggerHaptic()`) for tactile/auditory delight.
  5. `components/index.js`: Main bundle exporting all elements.
  6. Add component DOM tests in `tests/components.test.mjs`.
- **Verification Commands**:
  - `node --test tests/components.test.mjs`
- **Expected Output**: Custom elements register without error; `aria-current` resolution tested.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `feat: add multi-sensory web components`.

### Task 4: Atomic Design Templates
- **Branch**: `feat/atomic-templates`
- **Actions**:
  1. `templates/home.template.html`: Clean template for homepages with hero, grid, and test suite.
  2. `templates/element.template.html`: Clean template for the 105 element reference pages (`/html/*/`) featuring spec link, demo box, code block, and native a11y checklist.
  3. `templates/guide.template.html`: Clean template for WCAG, Office, PDF, and Screenreader guides.
  4. `templates/lab.template.html`: Clean template for Sensory Lab comparing accessible vs inaccessible patterns.
  5. Include detailed "View Source" comments on each template explaining WCAG 2.2 AA SC rationale.
- **Verification Commands**:
  - `node scripts/validate-templates.mjs`
- **Expected Output**: All templates pass markup validity and landmark checks.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `feat: create atomic design templates`.

### Task 5: Agentic AI Documentation (llms.txt & llms-full.txt)
- **Branch**: `docs/llms-txt-and-governance`
- **Actions**:
  1. Author `llms.txt`: Project overview, token summary, SMACSS class map, custom elements reference, and strict rules for code refactoring.
  2. Author `llms-full.txt`: Complete machine-readable guide containing full copy-pasteable component recipes, CSS variable tables, and step-by-step instructions for local models (Gemma-4-31B / Gemma-4-26B).
  3. Author `DESIGN_SYSTEM.md`: Comprehensive human/conference governance guide explaining Japandi/SimpleAccess philosophy, multi-sensory sight/sound/touch architecture, and agentic workflows.
- **Verification Commands**:
  - Check file existence and link integrity in `llms.txt`.
- **Expected Output**: Clean markdown files with 100% verified paths.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `docs: add llms.txt, llms-full.txt, and conference governance`.

### Task 6: Interactive Showcase & Sensory Lab Documentation
- **Branch**: `feat/docs-showcase`
- **Actions**:
  1. `docs/index.html`: Interactive design system catalog.
  2. `docs/tokens.html`: Visual color contrast grid, typography scale, spacing visualizer.
  3. `docs/components.html`: Live interactive buttons, cards, nav, tables, skip links.
  4. `docs/sensory.html`: Interactive sight, sound, and touch playground (testing dark mode, audio earcons, and haptics).
- **Verification Commands**:
  - Local browser test or static server smoke check: `npx serve docs` / `python3 -m http.server`.
- **Expected Output**: Clean, 100% accessible showcase site.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `feat: build interactive design system showcase`.

### Task 7: Build & Packaging Pipeline
- **Branch**: `feat/build-and-dist`
- **Actions**:
  1. `scripts/build.mjs`: Consolidates `css/`, `components/`, and `tokens/` into standalone `dist/` directory:
     - `dist/simpleaccess.css`
     - `dist/simpleaccess.js`
     - `dist/tokens.json`
  2. Ensure `dist/` is easily copyable / consumable by `simpleaccess` static website without npm dependencies.
- **Verification Commands**:
  - `npm run build && test -f dist/simpleaccess.css && test -f dist/simpleaccess.js`
- **Expected Output**: Exit code 0, standalone distribution artifacts created.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `feat: finalize build pipeline and dist artifacts`.

---

## 8. Manual Verification Checklist for Final Pass

- [ ] `npm test` runs with 100% passing tests.
- [ ] Contrast ratios in `tokens.json` verified >= 4.5:1 for normal text, >= 3:1 for UI elements.
- [ ] Keyboard navigation: Tab through `docs/index.html` and verify gold `:focus-visible` indicator on every interactive atom.
- [ ] Screen reader check: Test `docs/index.html` with macOS VoiceOver (Cmd+F5); verify landmark navigation and skip link.
- [ ] Audio & Haptics: Test sensory demo button; verify gentle earcon chime and mobile haptic trigger.
- [ ] View Source: Inspect source code to verify clear, educational commentary for conference presentation.

---

## 9. Risks, Tradeoffs & Open Questions

- **Risk**: Over-engineering web components could hurt static site performance.
  - *Mitigation*: Components use Light DOM (not Shadow DOM) to ensure global CSS applies directly and semantic landmarks are directly exposed to the accessibility tree.
- **Risk**: Audio feedback could annoy users if uncontrolled.
  - *Mitigation*: Earcons are opt-in or restricted to interactive demo triggers, never autoplay, and respect `prefers-reduced-motion`.
- **Tradeoff**: Distributing as standalone static files in `dist/` vs npm registry package.
  - *Decision*: SimpleAccess is a pure static site deployed via Caddy. Building standalone static files in `dist/` allows simpleaccess to consume them zero-friction.

---

## 10. Principles

1. **Accessibility First**: WCAG 2.2 AA is the foundation, not an afterthought.
2. **Lean & Standards-Based**: Default to native HTML5 and CSS before JavaScript.
3. **Multi-Sensory Delight**: Design for sight, sound, and touch equally.
4. **Machine-Readable Precision**: Provide unambiguous tokens and `llms.txt` so AI agents perform flawless transformations.
5. **View-Source Educational Craft**: Every file is a learning resource worthy of international conference presentation.
