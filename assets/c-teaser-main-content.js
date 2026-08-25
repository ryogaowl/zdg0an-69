(function () {
  class TeaserMainContent extends HTMLElement {
    connectedCallback() {
      const targets = this.querySelectorAll('[data-reveal]');
      if (!targets.length) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion || !('IntersectionObserver' in window)) {
        targets.forEach((target) => target.classList.add('is-revealed'));
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            this.observer.unobserve(entry.target);
          });
        },
        {
          /* 画面下から 1/4 ほど入り込んだ時点で表示を開始する */
          rootMargin: '0px 0px -25% 0px',
          threshold: 0,
        }
      );

      targets.forEach((target) => this.observer.observe(target));
    }

    disconnectedCallback() {
      this.observer?.disconnect();
    }
  }

  if (!customElements.get('teaser-main-content')) {
    customElements.define('teaser-main-content', TeaserMainContent);
  }
})();
