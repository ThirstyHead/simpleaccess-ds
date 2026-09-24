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
