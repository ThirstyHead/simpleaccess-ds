import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const llmsPath = path.join(rootDir, 'llms.txt');
const llmsFullPath = path.join(rootDir, 'llms-full.txt');
const designSystemPath = path.join(rootDir, 'DESIGN_SYSTEM.md');

test('Documentation files exist at root', () => {
  assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist at root');
  assert.ok(fs.existsSync(llmsFullPath), 'llms-full.txt must exist at root');
  assert.ok(fs.existsSync(designSystemPath), 'DESIGN_SYSTEM.md must exist at root');
});

test('llms.txt conforms to llmstxt.org specification', () => {
  const content = fs.readFileSync(llmsPath, 'utf-8');
  assert.ok(content.startsWith('# SimpleAccess Design System'), 'llms.txt must start with H1 title');
  assert.ok(content.includes('> '), 'llms.txt must include blockquote summary per llmstxt.org spec');
  assert.ok(content.includes('## Core Architecture'), 'llms.txt must describe Core Architecture');
  assert.ok(content.includes('## Multi-Sensory Standards'), 'llms.txt must detail Sight, Sound, and Touch');
  assert.ok(content.includes('## Web Components'), 'llms.txt must describe custom elements');
  assert.ok(content.includes('## Agentic Workflow Guidance'), 'llms.txt must provide agent instructions');
});

test('DESIGN_SYSTEM.md provides comprehensive conference and governance guidance', () => {
  const content = fs.readFileSync(designSystemPath, 'utf-8');
  assert.ok(content.includes('# SimpleAccess Design System'), 'Must have main title');
  assert.ok(content.includes('SMACSS'), 'Must document SMACSS');
  assert.ok(content.includes('Atomic Design'), 'Must document Atomic Design');
  assert.ok(content.includes('WCAG 2.2 AA'), 'Must document WCAG 2.2 AA compliance');
  assert.ok(content.includes('Sight, Sound, and Touch'), 'Must document multi-sensory delight');
  assert.ok(content.includes('Agentic AI Workflows'), 'Must document conference presentation points on Agentic AI');
});
