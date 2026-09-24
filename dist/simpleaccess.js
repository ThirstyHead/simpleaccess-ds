/**
 * SimpleAccess Design System - Standalone Distribution JS Module
 * Version: 1.0.0
 * Standard: W3C Autonomous Custom Elements (Light DOM) + Web Audio/Haptic API
 */

/**
 * SimpleAccess Multi-Sensory Engine: Sight, Sound, and Touch
 * Delighting the senses while respecting WCAG 2.2 accessibility standards.
 */

let audioCtx = null;

/**
 * Checks if the user prefers reduced motion or quiet interactions
 */
function prefersQuiet() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Play a subtle, synthesized earcon using the Web Audio API.
 * Uses an exponential ramp envelope to prevent acoustic transients (clicks/pops).
 * 
 * @param {number} freq - Pitch frequency in Hz (default: 440Hz A4)
 * @param {number} duration - Duration in seconds (default: 0.06s)
 * @param {string} type - Oscillator waveform ('sine' | 'triangle')
 */
function playEarcon(freq = 440, duration = 0.06, type = 'sine') {
  if (typeof window === 'undefined') return;
  if (prefersQuiet()) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Soft attack and smooth exponential decay
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio contexts may be restricted until first user interaction; fail silently
    console.debug('SimpleAccess Earcon notice:', err);
  }
}

/**
 * Trigger a brief tactile haptic pulse on supported touch devices (e.g. mobile Safari / Chrome).
 * 
 * @param {number|number[]} pattern - Vibration duration in milliseconds (default: 12ms)
 */
function triggerHaptic(pattern = 12) {
  if (typeof window === 'undefined') return;
  if (prefersQuiet()) return;

  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics not allowed or denied by permissions policy
    }
  }
}

/**
 * Helper to attach simultaneous sound and haptic sensory feedback to an interactive element
 * 
 * @param {HTMLElement} element - The interactive button or control
 * @param {Object} options - Custom sensory parameters
 */
function attachSensoryFeedback(element, options = {}) {
  if (!element || typeof element.addEventListener !== 'function') return;

  const freq = options.freq || 440;
  const duration = options.duration || 0.06;
  const haptic = options.haptic || 12;

  element.addEventListener('click', () => {
    playEarcon(freq, duration);
    triggerHaptic(haptic);
  });
}


/**
 * SimpleAccess Design System: Header Web Component
 * Standard: W3C Custom Elements (Autonomous Custom Element)
 * Accessibility: Light DOM to preserve semantic landmark hierarchy for screen readers (WCAG 2.2 SC 1.3.1).
 */
class DsHeader extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'SimpleAccess.io';
    const tagline = this.getAttribute('tagline') || 'Delighting the Senses: Sight, Sound, and Touch';
    const isSubpage = this.hasAttribute('subpage') || this.getAttribute('subpage') === 'true';

    const homeUrl = this.getAttribute('home-url') || '/';

    // In subpages, the primary h1 belongs in <main>, so header uses an educational link/banner
    const headingMarkup = isSubpage
      ? `<p class="l-header__title"><a href="${this.escape(homeUrl)}" style="color: inherit; text-decoration: none; font-weight: 700; font-size: 1.5rem;">${this.escape(title)}</a></p>`
      : `<h1 class="l-header__title" style="margin-top: 0; font-size: 2.25rem; color: var(--sys-color-text-inverse, #ffffff);">${this.escape(title)}</h1>`;

    this.innerHTML = `
      <header class="l-header">
        ${headingMarkup}
        <p class="l-header__tagline" style="margin: 0.5rem 0 0 0; opacity: 0.9; color: var(--sys-color-text-inverse, #ffffff);">${this.escape(tagline)}</p>
      </header>
    `;
  }

  escape(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ds-header')) {
  customElements.define('ds-header', DsHeader);
}

export { DsHeader };


/**
 * SimpleAccess Design System: Navigation Web Component
 * Standard: W3C Custom Elements (Autonomous Custom Element)
 * Accessibility: WCAG 2.2 SC 3.2.3 (Consistent Navigation) and SC 4.1.2 (Name, Role, Value).
 * Dynamically computes aria-current="page" based on window.location.pathname.
 * Supports mode="site" (default for simpleaccess.io) and mode="ds" (for design system showcase).
 */
class DsNav extends HTMLElement {
  connectedCallback() {
    // If the component already contains slotted child navigation, preserve and enhance it
    if (this.querySelector('ul') || this.querySelector('a')) {
      return;
    }

    const mode = this.getAttribute('mode') || 'site';
    const baseUrl = this.getAttribute('base-url') || '';
    const isSubpage = this.hasAttribute('subpage') || this.getAttribute('subpage') === 'true';
    const prefix = isSubpage ? '../' : '';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const currentHash = typeof window !== 'undefined' ? window.location.hash : '';

    let links = [];
    let navLabel = 'Global Sections';

    if (mode === 'ds') {
      navLabel = 'Design System Sections';
      links = [
        { href: `${prefix}#overview`, label: 'Overview' },
        { href: `${prefix}#sensory-demo`, label: 'Sensory Lab' },
        { href: `${prefix}#components`, label: 'Components' },
        { href: `${prefix}#tokens`, label: 'Tokens' },
        { href: `${prefix}templates/home.template.html`, label: 'Templates' },
        { href: `${prefix}docs/`, label: 'Governance Spec' },
        { 
          href: `${prefix}llms.txt`, 
          label: 'AI Spec', 
          badge: '.TXT', 
          formatHint: 'opens raw plain text manifest for AI models',
          type: 'text/plain'
        },
        { href: 'https://simpleaccess.io/', label: 'SimpleAccess.io \u2197', external: true }
      ];
    } else {
      navLabel = 'Global Sections';
      links = [
        { href: `${baseUrl}/`, label: 'Home' },
        { href: `${baseUrl}/guides/wcag/`, label: 'WCAG Principles' },
        { href: `${baseUrl}/guides/screenreaders/`, label: 'Screen Readers' },
        { href: `${baseUrl}/guides/office/`, label: 'MS Office' },
        { href: `${baseUrl}/guides/adobe/pdf/`, label: 'Adobe PDF' },
        { href: `${baseUrl}/sensory-lab/`, label: 'Sensory Lab' },
        { href: `${baseUrl}/html/`, label: 'HTML Elements' },
        { href: `${baseUrl}/guides/makingof/`, label: 'Making Of' }
      ];
    }

    const itemsMarkup = links.map(link => {
      let isCurrent = false;

      if (mode === 'ds') {
        if (link.href.startsWith('#')) {
          isCurrent = currentHash === link.href;
        } else if (!link.external) {
          isCurrent = currentPath.endsWith(link.href);
        }
      } else {
        const pathOnly = link.href.replace(/^https?:\/\/[^/]+/, '');
        isCurrent = pathOnly === '/'
          ? (currentPath === '/' || currentPath === '/index.html')
          : (currentPath.startsWith(pathOnly));
      }

      const ariaCurrent = isCurrent ? ' aria-current="page"' : '';
      const currentClass = isCurrent ? ' is-current' : '';
      const externalAttrs = link.external ? ' rel="external" target="_blank"' : '';
      const typeAttr = link.type ? ` type="${link.type}"` : '';
      const badgeMarkup = link.badge ? ` <span class="m-badge m-badge--neutral m-badge--sm">${link.badge}</span>` : '';
      const hintMarkup = link.formatHint ? `<span class="u-visually-hidden"> (${link.formatHint})</span>` : '';

      return `<li><a href="${link.href}" class="m-nav-link${currentClass}"${ariaCurrent}${externalAttrs}${typeAttr}>${link.label}${badgeMarkup}${hintMarkup}</a></li>`;
    }).join('\n        ');

    const ariaLabel = mode === 'ds'
      ? 'aria-label="Design System Sections"'
      : 'aria-label="Global Sections"';

    this.innerHTML = `
      <nav class="l-nav" ${ariaLabel}>
        <ul class="m-nav-list">
          ${itemsMarkup}
        </ul>
      </nav>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ds-nav')) {
  customElements.define('ds-nav', DsNav);
}

export { DsNav };


/**
 * SimpleAccess Design System: Footer Web Component
 * Standard: W3C Custom Elements (Autonomous Custom Element)
 * Accessibility: Light DOM to preserve semantic landmark hierarchy for screen readers (WCAG 2.2 SC 1.3.1).
 */
class DsFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="l-footer">
        <p>&copy; 2026 <a href="https://thirstyhead.com/">ThirstyHead</a>. Built with standard HTML5, SMACSS, and W3C Design Tokens.</p>
        <p>WCAG 2.2 AA Multi-Sensory Design System &bull; Delighting Sight, Sound, and Touch.</p>
      </footer>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ds-footer')) {
  customElements.define('ds-footer', DsFooter);
}

export { DsFooter };


export {
  DsHeader,
  DsNav,
  DsFooter,
  playEarcon,
  triggerHaptic,
  attachSensoryFeedback,
  prefersQuiet
};
