import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');

const headerPath = path.join(componentsDir, 'ds-header.js');
const navPath = path.join(componentsDir, 'ds-nav.js');
const footerPath = path.join(componentsDir, 'ds-footer.js');
const sensoryPath = path.join(componentsDir, 'ds-sensory.js');
const indexPath = path.join(componentsDir, 'index.js');

test('All component source files exist', () => {
  assert.ok(fs.existsSync(headerPath), 'components/ds-header.js must exist');
  assert.ok(fs.existsSync(navPath), 'components/ds-nav.js must exist');
  assert.ok(fs.existsSync(footerPath), 'components/ds-footer.js must exist');
  assert.ok(fs.existsSync(sensoryPath), 'components/ds-sensory.js must exist');
  assert.ok(fs.existsSync(indexPath), 'components/index.js must exist');
});

test('ds-header.js implements accessible Light DOM header', () => {
  const code = fs.readFileSync(headerPath, 'utf-8');
  assert.ok(code.includes('customElements.define'), 'Must register custom element');
  assert.ok(code.includes('ds-header'), 'Element name must be ds-header');
  assert.ok(code.includes('l-header'), 'Must render SMACSS .l-header');
  assert.ok(!code.includes('attachShadow'), 'Must use Light DOM to preserve semantic accessibility tree');
});

test('ds-nav.js implements accessible navigation and aria-current="page"', () => {
  const code = fs.readFileSync(navPath, 'utf-8');
  assert.ok(code.includes('customElements.define'), 'Must register custom element');
  assert.ok(code.includes('ds-nav'), 'Element name must be ds-nav');
  assert.ok(code.includes('aria-label="Global Sections"') || code.includes("aria-label='Global Sections'"), 'Must define distinct accessible nav label');
  assert.ok(code.includes('aria-current'), 'Must compute aria-current="page"');
  assert.ok(code.includes('/sensory-lab/'), 'Must link to sensory lab');
  assert.ok(code.includes('/html/'), 'Must link to HTML reference');
  assert.ok(!code.includes('attachShadow'), 'Must use Light DOM to preserve landmark semantics');
});

test('ds-footer.js implements accessible footer', () => {
  const code = fs.readFileSync(footerPath, 'utf-8');
  assert.ok(code.includes('customElements.define'), 'Must register custom element');
  assert.ok(code.includes('ds-footer'), 'Element name must be ds-footer');
  assert.ok(code.includes('l-footer'), 'Must render SMACSS .l-footer');
  assert.ok(code.includes('ThirstyHead'), 'Must attribute ThirstyHead');
  assert.ok(code.includes('https://thirstyhead.com/'), 'Must link to https://thirstyhead.com/');
});

test('ds-sensory.js exports accessible audio earcon and tactile haptic utilities', () => {
  const code = fs.readFileSync(sensoryPath, 'utf-8');
  assert.ok(code.includes('playEarcon'), 'Must export playEarcon function');
  assert.ok(code.includes('triggerHaptic'), 'Must export triggerHaptic function');
  assert.ok(code.includes('AudioContext') || code.includes('webkitAudioContext'), 'Must use Web Audio API');
  assert.ok(code.includes('navigator.vibrate'), 'Must use Web Haptic vibration API');
  assert.ok(code.includes('prefers-reduced-motion'), 'Must check user reduced motion preference');
});
