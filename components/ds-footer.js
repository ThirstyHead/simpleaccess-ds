/**
 * SimpleAccess Design System: Footer Web Component
 * Standard: W3C Custom Elements (Autonomous Custom Element)
 * Accessibility: Light DOM to preserve semantic landmark hierarchy for screen readers (WCAG 2.2 SC 1.3.1).
 */
class DsFooter extends HTMLElement {
  async connectedCallback() {
    const versionAttr = this.getAttribute('version');
    let version = versionAttr;

    if (!version) {
      try {
        const response = await fetch('/package.json');
        if (response.ok) {
          const data = await response.json();
          version = data.version;
        }
      } catch (e) {
        console.debug('SimpleAccess Footer: Could not fetch version from package.json', e);
      }
    }

    const versionMarkup = version ? `<p class="u-version">Version: ${this.escape(version)}</p>` : '';

    this.innerHTML = `
      <footer class="l-footer">
        <p>&copy; 2026 <a href="https://thirstyhead.com/">ThirstyHead</a>. Built with standard HTML5, SMACSS, and W3C Design Tokens.</p>
        <p>WCAG 2.2 AA Multi-Sensory Design System &bull; Delighting Sight, Sound, and Touch.</p>
        ${versionMarkup}
      </footer>
    `;
  }

  escape(str) {
    return str.replace(/[&<>'\"\n]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
      '\n': ' '
    }[tag] || tag));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ds-footer')) {
  customElements.define('ds-footer', DsFooter);
}

export { DsFooter };
