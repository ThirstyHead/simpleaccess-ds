import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.join(rootDir, 'templates');

const homePath = path.join(templatesDir, 'home.template.html');
const elementPath = path.join(templatesDir, 'element.template.html');
const guidePath = path.join(templatesDir, 'guide.template.html');
const labPath = path.join(templatesDir, 'lab.template.html');

test('All Atomic Design templates exist', () => {
  assert.ok(fs.existsSync(homePath), 'templates/home.template.html must exist');
  assert.ok(fs.existsSync(elementPath), 'templates/element.template.html must exist');
  assert.ok(fs.existsSync(guidePath), 'templates/guide.template.html must exist');
  assert.ok(fs.existsSync(labPath), 'templates/lab.template.html must exist');
});

test('All templates adhere to standard accessibility landmarks and skip link', () => {
  const templates = [homePath, elementPath, guidePath, labPath];
  for (const tplPath of templates) {
    const html = fs.readFileSync(tplPath, 'utf-8');
    assert.ok(html.includes('<!DOCTYPE html>'), `${tplPath} must specify DOCTYPE`);
    assert.ok(html.includes('<html lang="en">'), `${tplPath} must specify lang="en"`);
    assert.ok(html.includes('class="m-skip-link"'), `${tplPath} must include accessible skip link`);
    assert.ok(html.includes('<ds-header'), `${tplPath} must include <ds-header>`);
    assert.ok(html.includes('<ds-nav'), `${tplPath} must include <ds-nav>`);
    assert.ok(html.includes('<main id="main-content"'), `${tplPath} must include <main id="main-content">`);
    assert.ok(html.includes('<ds-footer'), `${tplPath} must include <ds-footer>`);
    assert.ok(html.includes('<!--'), `${tplPath} must include educational "View Source" comments`);
  }
});

test('Template-specific component requirements are satisfied', () => {
  const homeHtml = fs.readFileSync(homePath, 'utf-8');
  assert.ok(homeHtml.includes('m-hero'), 'Home template must include .m-hero');
  assert.ok(homeHtml.includes('m-card'), 'Home template must include .m-card');
  assert.ok(homeHtml.includes('m-manifesto'), 'Home template must include .m-manifesto');

  const elemHtml = fs.readFileSync(elementPath, 'utf-8');
  assert.ok(elemHtml.includes('m-demo'), 'Element template must include .m-demo');
  assert.ok(elemHtml.includes('m-ref-link'), 'Element template must include .m-ref-link');

  const guideHtml = fs.readFileSync(guidePath, 'utf-8');
  assert.ok(guideHtml.includes('m-badge'), 'Guide template must include .m-badge');
  assert.ok(guideHtml.includes('m-table'), 'Guide template must include .m-table');

  const labHtml = fs.readFileSync(labPath, 'utf-8');
  assert.ok(labHtml.includes('m-btn'), 'Lab template must include .m-btn');
});
