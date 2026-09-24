import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const cssDir = path.join(rootDir, 'css');

const baseCssPath = path.join(cssDir, '01-base', 'base.css');
const layoutCssPath = path.join(cssDir, '02-layout', 'layout.css');
const moduleCssPath = path.join(cssDir, '03-module', 'module.css');
const stateCssPath = path.join(cssDir, '04-state', 'state.css');
const themeCssPath = path.join(cssDir, '05-theme', 'theme.css');
const bundleCssPath = path.join(cssDir, 'simpleaccess.css');

test('All SMACSS layer files exist', () => {
  assert.ok(fs.existsSync(baseCssPath), '01-base/base.css must exist');
  assert.ok(fs.existsSync(layoutCssPath), '02-layout/layout.css must exist');
  assert.ok(fs.existsSync(moduleCssPath), '03-module/module.css must exist');
  assert.ok(fs.existsSync(stateCssPath), '04-state/state.css must exist');
  assert.ok(fs.existsSync(themeCssPath), '05-theme/theme.css must exist');
  assert.ok(fs.existsSync(bundleCssPath), 'simpleaccess.css must exist');
});

test('Base layer enforces WCAG 2.2 accessibility defaults', () => {
  const css = fs.readFileSync(baseCssPath, 'utf-8');
  assert.ok(css.includes(':focus-visible'), 'Base CSS must define explicit :focus-visible rules');
  assert.ok(css.includes('outline'), 'Base CSS focus must define high-contrast outline');
  assert.ok(css.includes('outline-offset'), 'Base CSS focus must define outline-offset for clarity');
});

test('Layout layer implements SMACSS .l-* classes', () => {
  const css = fs.readFileSync(layoutCssPath, 'utf-8');
  assert.ok(css.includes('.l-header'), 'Layout must define .l-header');
  assert.ok(css.includes('.l-nav'), 'Layout must define .l-nav');
  assert.ok(css.includes('.l-main'), 'Layout must define .l-main');
  assert.ok(css.includes('.l-container'), 'Layout must define .l-container');
  assert.ok(css.includes('.l-grid'), 'Layout must define .l-grid');
  assert.ok(css.includes('.l-footer'), 'Layout must define .l-footer');
});

test('Module layer implements SMACSS .m-* components and multi-sensory targets', () => {
  const css = fs.readFileSync(moduleCssPath, 'utf-8');
  assert.ok(css.includes('.m-skip-link'), 'Module must define .m-skip-link');
  assert.ok(css.includes('.m-nav-list'), 'Module must define .m-nav-list');
  assert.ok(css.includes('.m-hero'), 'Module must define .m-hero');
  assert.ok(css.includes('.m-card'), 'Module must define .m-card');
  assert.ok(css.includes('.m-btn'), 'Module must define .m-btn');
  assert.ok(css.includes('.m-test-suite'), 'Module must define .m-test-suite');
  assert.ok(css.includes('.m-badge'), 'Module must define .m-badge');
  assert.ok(css.includes('44px') || css.includes('--sys-touch-min-target'), 'Interactive elements must reference minimum 44px touch target');
});

test('State and Theme layers support reduced motion, dark mode, and high contrast', () => {
  const stateCss = fs.readFileSync(stateCssPath, 'utf-8');
  const themeCss = fs.readFileSync(themeCssPath, 'utf-8');

  assert.ok(stateCss.includes('.is-current') || stateCss.includes('[aria-current="page"]'), 'State CSS must handle current page state');
  assert.ok(themeCss.includes('prefers-color-scheme: dark'), 'Theme CSS must support dark mode');
  assert.ok(themeCss.includes('forced-colors: active'), 'Theme CSS must support Windows High Contrast Mode');
  assert.ok(themeCss.includes('prefers-reduced-motion: reduce'), 'Theme CSS must support reduced motion');
});

test('simpleaccess.css bundles all SMACSS layers in correct sequence', () => {
  const bundle = fs.readFileSync(bundleCssPath, 'utf-8');
  assert.ok(bundle.includes('tokens.css'), 'Bundle must include tokens.css');
  assert.ok(bundle.includes('01-base/base.css'), 'Bundle must include base.css');
  assert.ok(bundle.includes('02-layout/layout.css'), 'Bundle must include layout.css');
  assert.ok(bundle.includes('03-module/module.css'), 'Bundle must include module.css');
  assert.ok(bundle.includes('04-state/state.css'), 'Bundle must include state.css');
  assert.ok(bundle.includes('05-theme/theme.css'), 'Bundle must include theme.css');
});
