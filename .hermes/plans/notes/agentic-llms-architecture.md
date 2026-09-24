# Agentic LLMs & Machine-Readable Architecture

SimpleAccess is designed for dual consumption: human engineers inspecting markup ("View Source") and agentic AI models executing automated tasks (Gemma-4-31b dense, Gemma-4-26b MoE, Gemini-3.8-flash).

## 1. llms.txt & llms-full.txt (https://llmstxt.org/)
- **Purpose**: High-bandwidth, unambiguous context files placed at the repository root.
- **Content Hierarchy**:
  - `llms.txt`: Project overview, design tokens summary, SMACSS class catalog, custom web components reference, and strict rules for code refactoring.
  - `llms-full.txt`: Full copy-pasteable component markup snippets, exact CSS class lists, template recipes (Home, Element, Guide, Lab), and automated testing instructions.
- **Why this unlocks local models (Gemma-4-31B / Gemma-4-26B)**:
  - Local models have focused context windows and do not benefit from rambling prose.
  - Standardized component recipes and predictable CSS class names (`.l-*`, `.m-*`, `.is-*`) allow Gemma models to transform pages deterministically without guessing or hallucinating classes.

## 2. W3C DTCG Token Specification 2025.10 (https://www.designtokens.org/tr/2025.10/)
- Source of truth: `tokens.json`.
- Standardized `$type` fields (`color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`).
- Semantic aliasing: `{color.palette.navy}` mapped into `{color.sys.action.primary}`.
- Automated token compiler script (`scripts/build-tokens.js` or `build-tokens.mjs` in vanilla node) outputs:
  - `css/tokens.css` (CSS custom properties)
  - `dist/tokens.json`
  - `docs/tokens-data.json`

## 3. Educational "View Source" Paradigm
- Inline comments explain *why* accessibility attributes exist:
  - `<!-- View Source Note: WCAG 2.2 SC 2.4.1 Bypass Blocks - Allows keyboard users to skip nav -->`
  - `<!-- View Source Note: Web Component ds-nav dynamically applies aria-current="page" based on window.location.pathname -->`
- Conference demo value: Scott demonstrates live how an AI agent uses `llms.txt` + `tokens.json` + `simpleaccess.css` to take an unstyled or drifting page and transform it into an accessible masterpiece.
