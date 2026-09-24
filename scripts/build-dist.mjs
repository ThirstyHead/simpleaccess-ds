/**
 * SimpleAccess Design System: Dist Bundler
 * Compiles standalone production distribution bundles for CSS and JS.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const cssDir = path.join(rootDir, 'css');
const componentsDir = path.join(rootDir, 'components');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Compile dist/simpleaccess.css (concatenated bundle)
const cssFiles = [
  path.join(cssDir, 'tokens.css'),
  path.join(cssDir, '01-base', 'base.css'),
  path.join(cssDir, '02-layout', 'layout.css'),
  path.join(cssDir, '03-module', 'module.css'),
  path.join(cssDir, '04-state', 'state.css'),
  path.join(cssDir, '05-theme', 'theme.css'),
];

let bundleCss = `/* ==========================================================================
   SIMPLEACCESS DESIGN SYSTEM - STANDALONE DISTRIBUTION CSS
   Version: 1.0.0
   License: MIT
   Author: Scott Davis <scott@thirstyhead.com>
   Standards: WCAG 2.2 AA / W3C DTCG 2025.10 / SMACSS
   ========================================================================== */\n\n`;

for (const file of cssFiles) {
  if (fs.existsSync(file)) {
    bundleCss += `\n/* --- Section: ${path.basename(file)} --- */\n`;
    bundleCss += fs.readFileSync(file, 'utf-8') + '\n';
  }
}

fs.writeFileSync(path.join(distDir, 'simpleaccess.css'), bundleCss, 'utf-8');
console.log('✓ Compiled dist/simpleaccess.css');

// 2. Compile dist/simpleaccess.js (standalone module bundle)
const headerJs = fs.readFileSync(path.join(componentsDir, 'ds-header.js'), 'utf-8');
const navJs = fs.readFileSync(path.join(componentsDir, 'ds-nav.js'), 'utf-8');
const footerJs = fs.readFileSync(path.join(componentsDir, 'ds-footer.js'), 'utf-8');
const sensoryJs = fs.readFileSync(path.join(componentsDir, 'ds-sensory.js'), 'utf-8');

// Strip export/import statements to combine cleanly into a single self-contained bundle
const cleanJs = (code) => {
  return code
    .replace(/^import\s+.*?;\s*$/gm, '')
    .replace(/^export\s+(class|function|const|let)\s+/gm, '$1 ')
    .replace(/^export\s+\{.*?\};?\s*$/gm, '');
};

const bundleJs = `/**
 * SimpleAccess Design System - Standalone Distribution JS Module
 * Version: 1.0.0
 * Standard: W3C Autonomous Custom Elements (Light DOM) + Web Audio/Haptic API
 */

${cleanJs(sensoryJs)}

${cleanJs(headerJs)}

${cleanJs(navJs)}

${cleanJs(footerJs)}

export {
  DsHeader,
  DsNav,
  DsFooter,
  playEarcon,
  triggerHaptic,
  attachSensoryFeedback,
  prefersQuiet
};
`;

fs.writeFileSync(path.join(distDir, 'simpleaccess.js'), bundleJs, 'utf-8');
console.log('✓ Compiled dist/simpleaccess.js');

// 3. Copy tokens.json to dist/tokens.json
fs.copyFileSync(path.join(rootDir, 'tokens.json'), path.join(distDir, 'tokens.json'));
console.log('✓ Copied dist/tokens.json');
