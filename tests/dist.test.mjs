import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const distCssPath = path.join(distDir, 'simpleaccess.css');
const distJsPath = path.join(distDir, 'simpleaccess.js');
const distTokensPath = path.join(distDir, 'tokens.json');
const pkgPath = path.join(rootDir, 'package.json');

test('Package exports and scripts are properly configured', () => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  assert.ok(pkg.scripts.build, 'Must have "build" script');
  assert.ok(pkg.scripts.audit, 'Must have "audit" script');
  assert.ok(pkg.exports, 'Must have "exports" map');
  assert.ok(pkg.exports['.'], 'Must export main JS module');
  assert.ok(pkg.exports['./css'], 'Must export CSS bundle');
});

test('Dist bundle files exist and contain full standalone assets', () => {
  assert.ok(fs.existsSync(distCssPath), 'dist/simpleaccess.css must exist');
  assert.ok(fs.existsSync(distJsPath), 'dist/simpleaccess.js must exist');
  assert.ok(fs.existsSync(distTokensPath), 'dist/tokens.json must exist');

  const css = fs.readFileSync(distCssPath, 'utf-8');
  assert.ok(css.includes('--sys-color-interactive-primary'), 'Dist CSS must include tokens');
  assert.ok(css.includes('.l-header'), 'Dist CSS must include layout classes');
  assert.ok(css.includes('.m-hero'), 'Dist CSS must include module classes');
  assert.ok(css.includes(':focus-visible'), 'Dist CSS must include focus indicators');
  assert.ok(css.includes('forced-colors'), 'Dist CSS must include theme queries');

  const js = fs.readFileSync(distJsPath, 'utf-8');
  assert.ok(js.includes('ds-header'), 'Dist JS must register ds-header');
  assert.ok(js.includes('ds-nav'), 'Dist JS must register ds-nav');
  assert.ok(js.includes('ds-footer'), 'Dist JS must register ds-footer');
  assert.ok(js.includes('playEarcon'), 'Dist JS must export playEarcon');
  assert.ok(js.includes('triggerHaptic'), 'Dist JS must export triggerHaptic');
});
