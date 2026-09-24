/**
 * SimpleAccess Design System: Navigation Web Component
 * Standard: W3C Custom Elements (Autonomous Custom Element)
 * Accessibility: WCAG 2.2 SC 3.2.3 (Consistent Navigation) and SC 4.1.2 (Name, Role, Value).
 * Dynamically computes aria-current="page" based on window.location.pathname.
 */
class DsNav extends HTMLElement {
  connectedCallback() {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    const links = [
      { href: '/', label: 'Home' },
      { href: '/guides/wcag/', label: 'WCAG Principles' },
      { href: '/guides/screenreaders/', label: 'Screen Readers' },
      { href: '/guides/office/', label: 'MS Office' },
      { href: '/guides/adobe/pdf/', label: 'Adobe PDF' },
      { href: '/sensory-lab/', label: 'Sensory Lab' },
      { href: '/html/', label: 'HTML Elements' },
      { href: '/guides/makingof/', label: 'Making Of' }
    ];

    const itemsMarkup = links.map(link => {
      const isCurrent = link.href === '/'
        ? (currentPath === '/' || currentPath === '/index.html')
        : (currentPath.startsWith(link.href));

      const ariaCurrent = isCurrent ? ' aria-current="page"' : '';
      const currentClass = isCurrent ? ' is-current' : '';

      return `<li><a href="${link.href}" class="m-nav-link${currentClass}"${ariaCurrent}>${link.label}</a></li>`;
    }).join('\n        ');

    this.innerHTML = `
      <nav class="l-nav" aria-label="Global Sections">
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
