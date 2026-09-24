import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const showcasePath = path.join(rootDir, 'index.html');
const sensoryDocPath = path.join(rootDir, 'docs', 'sensory-architecture.md');

test('Interactive showcase index.html and sensory documentation exist', () => {
  assert.ok(fs.existsSync(showcasePath), 'index.html must exist at root as interactive showcase');
  assert.ok(fs.existsSync(sensoryDocPath), 'docs/sensory-architecture.md must exist');
});

test('Showcase index.html demonstrates all SMACSS modules and Web Components', () => {
  const html = fs.readFileSync(showcasePath, 'utf-8');
  assert.ok(html.includes('<html lang="en">'), 'Must have lang="en"');
  assert.ok(html.includes('class="m-skip-link"'), 'Must have skip link');
  assert.ok(html.includes('<ds-header'), 'Must have <ds-header>');
  assert.ok(html.includes('<ds-nav'), 'Must have <ds-nav>');
  assert.ok(html.includes('<ds-footer'), 'Must have <ds-footer>');
  assert.ok(html.includes('m-hero'), 'Must demonstrate .m-hero');
  assert.ok(html.includes('m-card'), 'Must demonstrate .m-card');
  assert.ok(html.includes('m-btn'), 'Must demonstrate .m-btn');
  assert.ok(html.includes('m-table'), 'Must demonstrate .m-table');
  assert.ok(html.includes('m-badge'), 'Must demonstrate .m-badge');
  assert.ok(html.includes('m-manifesto'), 'Must demonstrate .m-manifesto');
  assert.ok(html.includes('playEarcon') || html.includes('ds-sensory.js'), 'Must integrate sensory audio');
});

test('docs/sensory-architecture.md covers sight, sound, touch conference specifications', () => {
  const doc = fs.readFileSync(sensoryDocPath, 'utf-8');
  assert.ok(doc.includes('Sight'), 'Must cover Sight');
  assert.ok(doc.includes('Sound'), 'Must cover Sound');
  assert.ok(doc.includes('Touch'), 'Must cover Touch');
  assert.ok(doc.includes('Web Audio API'), 'Must explain Web Audio API earcons');
  assert.ok(doc.includes('navigator.vibrate'), 'Must explain navigator.vibrate haptics');
  assert.ok(doc.includes('WCAG 2.2'), 'Must cite WCAG 2.2');
});
