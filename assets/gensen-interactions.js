if (!customElements.get('gensen-faq')) {
  customElements.define('gensen-faq', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      this.animations = new Map();
      this.addEventListener('click', (event) => {
        const summary = event.target.closest('summary');
        if (!summary || !this.contains(summary)) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        event.preventDefault();
        const details = summary.parentElement;
        const current = this.animations.get(details);
        const opening = current ? !current.opening : !details.open;
        const from = details.getBoundingClientRect().height;
        current?.animation.cancel();
        details.open = true;
        const styles = getComputedStyle(details);
        const borders = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        const to = opening ? details.scrollHeight + borders : summary.getBoundingClientRect().height + borders;
        details.style.overflow = 'hidden';
        const animation = details.animate({ height: [`${from}px`, `${to}px`] }, { duration: 260, easing: 'cubic-bezier(.22, 1, .36, 1)' });
        this.animations.set(details, { animation, opening });
        animation.onfinish = () => {
          details.open = opening;
          details.style.overflow = '';
          this.animations.delete(details);
        };
      }, { signal: this.controller.signal });
    }

    disconnectedCallback() {
      this.controller?.abort();
      this.animations?.forEach(({ animation }, details) => {
        animation.cancel();
        details.style.overflow = '';
      });
      this.animations?.clear();
    }
  });
}
