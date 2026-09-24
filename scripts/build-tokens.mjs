#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const tokensPath = path.join(rootDir, 'tokens.json');
const cssOutputDir = path.join(rootDir, 'css');
const distOutputDir = path.join(rootDir, 'dist');
const cssOutputFile = path.join(cssOutputDir, 'tokens.css');
const distOutputFile = path.join(distOutputDir, 'tokens.json');

// Ensure output directories exist
fs.mkdirSync(cssOutputDir, { recursive: true });
fs.mkdirSync(distOutputDir, { recursive: true });

// Read raw tokens
const raw = fs.readFileSync(tokensPath, 'utf-8');
const tokens = JSON.parse(raw);

// Resolve alias references: {color.palette.navy} -> actual value
function resolveValue(val, root) {
  if (typeof val !== 'string' || !val.startsWith('{') || !val.endsWith('}')) {
    return val;
  }
  const pathParts = val.slice(1, -1).split('.');
  let current = root;
  for (const part of pathParts) {
    if (!current || !(part in current)) {
      throw new Error(`Unresolvable token reference: ${val}`);
    }
    current = current[part];
  }
  return current.$value !== undefined ? resolveValue(current.$value, root) : current;
}

// Generate CSS Custom Properties
const cssLines = [
  '/* ==========================================================================',
  '   DESIGN TOKENS (Generated from tokens.json - W3C DTCG 2025.10)',
  '   WCAG 2.2 AA Multi-Sensory Standards (Sight, Sound, Touch)',
  '   ========================================================================== */',
  ':root {',
  '  /* --- Backward-Compatible Variables (SimpleAccess Baseline 1.0.0) --- */',
  `  --color-primary: ${resolveValue(tokens.color.palette.navy.$value, tokens)};`,
  `  --color-accent: ${resolveValue(tokens.color.palette.gold.$value, tokens)};`,
  `  --color-focus: ${resolveValue(tokens.color.palette.gold_metallic.$value, tokens)};`,
  `  --color-text: ${resolveValue(tokens.color.palette.charcoal.$value, tokens)};`,
  `  --color-bg: ${resolveValue(tokens.color.palette.canvas.$value, tokens)};`,
  `  --color-white: ${resolveValue(tokens.color.palette.white.$value, tokens)};`,
  `  --font-main: ${tokens.typography.fontFamily.main.$value};`,
  `  --font-mono: ${tokens.typography.fontFamily.mono.$value};`,
  `  --line-height: ${tokens.typography.lineHeight.body.$value};`,
  '',
  '  /* --- Semantic Color System --- */',
  `  --sys-color-bg-canvas: ${resolveValue(tokens.color.sys.bg.canvas.$value, tokens)};`,
  `  --sys-color-bg-surface: ${resolveValue(tokens.color.sys.bg.surface.$value, tokens)};`,
  `  --sys-color-bg-container: ${resolveValue(tokens.color.sys.bg.container.$value, tokens)};`,
  `  --sys-color-text-main: ${resolveValue(tokens.color.sys.text.main.$value, tokens)};`,
  `  --sys-color-text-muted: ${resolveValue(tokens.color.sys.text.muted.$value, tokens)};`,
  `  --sys-color-text-inverse: ${resolveValue(tokens.color.sys.text.inverse.$value, tokens)};`,
  `  --sys-color-text-accent: ${resolveValue(tokens.color.sys.text.accent.$value, tokens)};`,
  `  --sys-color-interactive-primary: ${resolveValue(tokens.color.sys.interactive.primary.$value, tokens)};`,
  `  --sys-color-interactive-hover: ${resolveValue(tokens.color.sys.interactive.hover.$value, tokens)};`,
  `  --sys-color-interactive-focus: ${resolveValue(tokens.color.sys.interactive.focus.$value, tokens)};`,
  `  --sys-color-interactive-accent: ${resolveValue(tokens.color.sys.interactive.accent.$value, tokens)};`,
  '',
  '  /* --- Typography Scale & Weights --- */',
  `  --sys-font-scale-xs: ${tokens.typography.scale.xs.$value};`,
  `  --sys-font-scale-sm: ${tokens.typography.scale.sm.$value};`,
  `  --sys-font-scale-base: ${tokens.typography.scale.base.$value};`,
  `  --sys-font-scale-md: ${tokens.typography.scale.md.$value};`,
  `  --sys-font-scale-lg: ${tokens.typography.scale.lg.$value};`,
  `  --sys-font-scale-xl: ${tokens.typography.scale.xl.$value};`,
  `  --sys-font-scale-xxl: ${tokens.typography.scale.xxl.$value};`,
  `  --sys-font-scale-display: ${tokens.typography.scale.display.$value};`,
  `  --sys-font-weight-regular: ${tokens.typography.fontWeight.regular.$value};`,
  `  --sys-font-weight-medium: ${tokens.typography.fontWeight.medium.$value};`,
  `  --sys-font-weight-semibold: ${tokens.typography.fontWeight.semibold.$value};`,
  `  --sys-font-weight-bold: ${tokens.typography.fontWeight.bold.$value};`,
  `  --sys-line-height-tight: ${tokens.typography.lineHeight.tight.$value};`,
  `  --sys-line-height-body: ${tokens.typography.lineHeight.body.$value};`,
  '',
  '  /* --- Spacing Scale --- */',
  `  --sys-space-xs: ${tokens.spacing.xs.$value};`,
  `  --sys-space-sm: ${tokens.spacing.sm.$value};`,
  `  --sys-space-md: ${tokens.spacing.md.$value};`,
  `  --sys-space-lg: ${tokens.spacing.lg.$value};`,
  `  --sys-space-xl: ${tokens.spacing.xl.$value};`,
  `  --sys-space-xxl: ${tokens.spacing.xxl.$value};`,
  `  --sys-space-huge: ${tokens.spacing.huge.$value};`,
  `  --sys-space-hero: ${tokens.spacing.hero.$value};`,
  '',
  '  /* --- Layout & Boundaries --- */',
  `  --sys-layout-container-max: ${tokens.layout.container_max.$value};`,
  `  --sys-layout-main-max: ${tokens.layout.main_max.$value};`,
  `  --sys-layout-grid-min-card: ${tokens.layout.grid_min_card.$value};`,
  `  --sys-border-radius-sm: ${tokens.border.radius_sm.$value};`,
  `  --sys-border-radius-md: ${tokens.border.radius_md.$value};`,
  `  --sys-border-radius-lg: ${tokens.border.radius_lg.$value};`,
  `  --sys-border-header-accent: ${tokens.border.accent_header.$value};`,
  `  --sys-border-card-lead: ${tokens.border.card_lead.$value};`,
  `  --sys-elevation-nav: ${tokens.elevation.nav.$value};`,
  `  --sys-elevation-card: ${tokens.elevation.card.$value};`,
  `  --sys-elevation-hero: ${tokens.elevation.hero.$value};`,
  '',
  '  /* --- Multi-Sensory: Touch & Motion --- */',
  `  --sys-touch-min-target: ${tokens.touch.min_target.$value};`,
  `  --sys-motion-fast: ${tokens.sensory.motion.transition_fast.$value};`,
  '}',
  '',
  '/* --- Sensory Lab Dark Mode Tokens --- */',
  '@media (prefers-color-scheme: dark) {',
  '  :root {',
  `    --sys-color-bg-canvas: ${tokens.color.palette.navy_dark.$value};`,
  '    --sys-color-bg-surface: #132238;',
  '    --sys-color-bg-container: #1b2e4b;',
  '    --sys-color-text-main: #f0f4f8;',
  '    --sys-color-text-muted: #cbd5e1;',
  '    --color-bg: #0a192f;',
  '    --color-text: #f0f4f8;',
  '    --color-white: #132238;',
  '  }',
  '}',
  ''
];

fs.writeFileSync(cssOutputFile, cssLines.join('\n'), 'utf-8');
console.log(`Generated CSS tokens at ${cssOutputFile}`);

// Copy tokens to dist
fs.writeFileSync(distOutputFile, JSON.stringify(tokens, null, 2), 'utf-8');
console.log(`Exported dist tokens at ${distOutputFile}`);
