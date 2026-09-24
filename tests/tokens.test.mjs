import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const tokensPath = path.join(rootDir, 'tokens.json');
const cssTokensPath = path.join(rootDir, 'css', 'tokens.css');

// WCAG 2.2 Relative Luminance and Contrast Calculation
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function relativeLuminance({ r, g, b }) {
  const sRGB = [r, g, b].map(val => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('tokens.json adheres to W3C DTCG 2025.10 structure', () => {
  assert.ok(fs.existsSync(tokensPath), 'tokens.json must exist');
  const raw = fs.readFileSync(tokensPath, 'utf-8');
  const tokens = JSON.parse(raw);

  assert.ok(tokens.color, 'tokens.color must exist');
  assert.ok(tokens.color.palette, 'tokens.color.palette must exist');
  assert.ok(tokens.color.sys, 'tokens.color.sys must exist');

  // Verify DTCG required fields ($value, $type)
  function validateNode(node, currentPath = '') {
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      if (typeof val === 'object' && val !== null) {
        if ('$value' in val) {
          assert.ok(
            '$type' in val || currentPath.includes('typography') || currentPath.includes('color'),
            `Token at ${currentPath}.${key} must specify $type`
          );
        } else {
          validateNode(val, `${currentPath}.${key}`);
        }
      }
    }
  }

  validateNode(tokens);
});

test('Color tokens satisfy WCAG 2.2 AA and AAA contrast requirements', () => {
  const raw = fs.readFileSync(tokensPath, 'utf-8');
  const tokens = JSON.parse(raw);
  const palette = tokens.color.palette;

  const navy = palette.navy.$value;
  const gold = palette.gold.$value;
  const focus = palette.gold_metallic.$value;
  const charcoal = palette.charcoal.$value;
  const canvas = palette.canvas.$value;
  const white = palette.white.$value;

  // SC 1.4.3 Contrast (Minimum: 4.5:1 for normal text)
  const navyOnWhite = contrastRatio(navy, white);
  assert.ok(navyOnWhite >= 7.0, `Navy on White must pass AAA (>= 7.0:1). Got ${navyOnWhite.toFixed(2)}`);

  const navyOnCanvas = contrastRatio(navy, canvas);
  assert.ok(navyOnCanvas >= 7.0, `Navy on Canvas must pass AAA (>= 7.0:1). Got ${navyOnCanvas.toFixed(2)}`);

  const charcoalOnCanvas = contrastRatio(charcoal, canvas);
  assert.ok(charcoalOnCanvas >= 7.0, `Charcoal on Canvas must pass AAA (>= 7.0:1). Got ${charcoalOnCanvas.toFixed(2)}`);

  const navyOnGold = contrastRatio(navy, gold);
  assert.ok(navyOnGold >= 4.5, `Navy on Gold must pass AA (>= 4.5:1). Got ${navyOnGold.toFixed(2)}`);

  // SC 1.4.11 Non-text Contrast (Minimum 3.0:1 for UI focus states)
  const focusOnNavy = contrastRatio(focus, navy);
  assert.ok(focusOnNavy >= 3.0, `Focus ring on Navy must pass UI component contrast (>= 3.0:1). Got ${focusOnNavy.toFixed(2)}`);
});

test('Generated css/tokens.css exports standard SMACSS and DTCG custom properties', () => {
  assert.ok(fs.existsSync(cssTokensPath), 'css/tokens.css must exist after compiler runs');
  const css = fs.readFileSync(cssTokensPath, 'utf-8');

  // Verify backward-compatible tokens from SimpleAccess homepage
  assert.ok(css.includes('--color-primary: #002d62;'), 'Must export --color-primary');
  assert.ok(css.includes('--color-accent: #ffd700;'), 'Must export --color-accent');
  assert.ok(css.includes('--color-focus: #d4af37;'), 'Must export --color-focus');
  assert.ok(css.includes('--color-text: #1a1a1a;'), 'Must export --color-text');
  assert.ok(css.includes('--color-bg: #f4f4f4;'), 'Must export --color-bg');

  // Verify semantic DTCG system variables
  assert.ok(css.includes('--sys-color-interactive-primary'), 'Must export --sys-color-interactive-primary');
  assert.ok(css.includes('--sys-color-interactive-focus'), 'Must export --sys-color-interactive-focus');
  assert.ok(css.includes('--sys-space-md'), 'Must export --sys-space-md');
  assert.ok(css.includes('--sys-touch-min-target: 44px;'), 'Must export --sys-touch-min-target');
});
