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
