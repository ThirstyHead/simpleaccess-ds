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
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const currentHash = typeof window !== 'undefined' ? window.location.hash : '';

    let links = [];
    let navLabel = 'Global Sections';

    if (mode === 'ds') {
      navLabel = 'Design System Sections';
      links = [
        { href: '#overview', label: 'Overview' },
        { href: '#sensory-demo', label: 'Sensory Lab' },
        { href: '#components', label: 'Components' },
        { href: '#tokens', label: 'Tokens' },
        { href: 'templates/home.template.html', label: 'Templates' },
        { href: 'DESIGN_SYSTEM.md', label: 'Docs' },
        { href: 'llms.txt', label: 'AI Spec (llms.txt)' },
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

      return `<li><a href="${link.href}" class="m-nav-link${currentClass}"${ariaCurrent}${externalAttrs}>${link.label}</a></li>`;
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
