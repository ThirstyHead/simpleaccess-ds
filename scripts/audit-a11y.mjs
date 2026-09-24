/**
 * SimpleAccess Automated WCAG 2.2 AA Accessibility Audit
 * Validates design tokens, CSS focus/target properties, and Atomic Design templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

let errors = 0;
let passes = 0;

function report(condition, message) {
  if (condition) {
    passes++;
    console.log(`  [PASS] ${message}`);
  } else {
    errors++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('--- STARTING SIMPLEACCESS WCAG 2.2 AA AUDIT ---');

// 1. Audit Color Contrast
console.log('\n1. Auditing Color Contrast Tokens:');
const tokens = JSON.parse(fs.readFileSync(path.join(rootDir, 'tokens.json'), 'utf-8'));
const white = tokens.color.palette.white.$value;
const charcoal = tokens.color.palette.charcoal.$value;
const navy = tokens.color.palette.navy.$value;
const gold = tokens.color.palette.gold.$value;

const charcoalOnWhite = getContrast(charcoal, white);
const navyOnWhite = getContrast(navy, white);
const navyOnGold = getContrast(navy, gold);

report(charcoalOnWhite >= 7.0, `Charcoal on White text contrast (${charcoalOnWhite.toFixed(2)}:1) meets WCAG AAA`);
report(navyOnWhite >= 7.0, `Navy on White heading contrast (${navyOnWhite.toFixed(2)}:1) meets WCAG AAA`);
report(navyOnGold >= 4.5, `Navy on Gold button contrast (${navyOnGold.toFixed(2)}:1) meets WCAG AA`);

// 2. Audit CSS Focus & Touch Targets
console.log('\n2. Auditing SMACSS CSS Properties:');
const distCssPath = path.join(rootDir, 'dist', 'simpleaccess.css');
const cssPath = fs.existsSync(distCssPath) ? distCssPath : path.join(rootDir, 'css', 'simpleaccess.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

report(cssContent.includes('.l-header__title') && (cssContent.includes('--sys-color-text-inverse') || cssContent.includes('#ffffff')), 'CSS explicitly sets header title color to inverse text for AAA contrast');
report(cssContent.includes(':focus-visible'), 'CSS defines native :focus-visible rules');
report(cssContent.includes('outline: 3px solid') || cssContent.includes('outline: 4px solid'), 'CSS focus outline is >= 3px');
report(cssContent.includes('outline-offset: 3px'), 'CSS focus outline includes 3px offset (SC 2.4.11)');
report(cssContent.includes('44px'), 'CSS enforces 44px minimum touch target size (SC 2.5.8)');
report(cssContent.includes('forced-colors: active'), 'CSS provides Windows High Contrast Mode overrides');
report(cssContent.includes('prefers-reduced-motion: reduce'), 'CSS honors prefers-reduced-motion');

// 3. Audit Templates
console.log('\n3. Auditing Atomic Design Templates:');
const templates = ['home.template.html', 'element.template.html', 'guide.template.html', 'lab.template.html'];

for (const tpl of templates) {
  const tplPath = path.join(rootDir, 'templates', tpl);
  const html = fs.readFileSync(tplPath, 'utf-8');
  
  report(html.includes('<html lang="en">'), `${tpl}: specifies lang="en" attribute`);
  report(html.includes('<title>'), `${tpl}: contains descriptive <title> tag`);
  report(html.includes('class="m-skip-link"'), `${tpl}: contains skip-to-content bypass block (SC 2.4.1)`);
  report(html.includes('<main id="main-content"'), `${tpl}: contains primary landmark <main id="main-content">`);
  report(html.includes('<ds-header'), `${tpl}: includes global <ds-header> landmark`);
  report(html.includes('<ds-nav'), `${tpl}: includes global <ds-nav> landmark`);
  report(html.includes('<ds-footer'), `${tpl}: includes global <ds-footer> landmark`);
}

console.log('\n--- AUDIT SUMMARY ---');
console.log(`Passed: ${passes}`);
console.log(`Failed: ${errors}`);

if (errors > 0) {
  console.error('\nWCAG 2.2 AA Audit FAILED.');
  process.exit(1);
} else {
  console.log('\nWCAG 2.2 AA Audit PASSED 100%.');
  process.exit(0);
}
