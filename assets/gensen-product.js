if (!customElements.get('gensen-product')) {
  customElements.define('gensen-product', class extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.addEventListener('click', (event) => {
        const thumbnail = event.target.closest('[data-media-target]');
        if (thumbnail) this.showMedia(thumbnail.dataset.mediaTarget);
        if (event.target.closest('.gensen-menu a')) this.querySelector('.gensen-menu')?.removeAttribute('open');
      });
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          const menu = this.querySelector('.gensen-menu[open]');
          if (menu) { menu.removeAttribute('open'); menu.querySelector('summary').focus(); }
        }
      });
      this.variantSelect = this.querySelector('[data-variant]');
      this.variantSelect?.addEventListener('change', () => this.updateVariant());
      this.querySelector('form')?.addEventListener('submit', (event) => {
        const button = this.querySelector('[name="add"]');
        if (button?.disabled || !event.target.checkValidity()) {
          event.preventDefault();
          event.stopImmediatePropagation();
          event.target.reportValidity();
        }
      }, true);
    }

    showMedia(mediaId) {
      const slides = [...this.querySelectorAll('[data-media-id]')];
      if (!slides.some((slide) => slide.dataset.mediaId === String(mediaId))) return;
      slides.forEach((slide) => {
        const hidden = slide.dataset.mediaId !== String(mediaId);
        slide.hidden = hidden;
        if (hidden) {
          slide.querySelectorAll('video').forEach((video) => video.pause());
          slide.querySelectorAll('iframe').forEach((frame) => {
            const url = new URL(frame.src);
            if (url.hostname.endsWith('youtube.com')) frame.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), url.origin);
            if (url.hostname === 'player.vimeo.com') frame.contentWindow?.postMessage(JSON.stringify({ method: 'pause' }), url.origin);
          });
        }
      });
      this.querySelectorAll('[data-media-target]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mediaTarget === String(mediaId))));
    }

    updateVariant() {
      const option = this.variantSelect.selectedOptions[0];
      if (!option) return;
      const price = this.querySelector('[data-price]');
      if (price) price.textContent = option.dataset.price;
      const quantity = this.querySelector('[name="quantity"]');
      if (quantity) {
        quantity.min = option.dataset.min || '1';
        quantity.step = option.dataset.step || '1';
        if (option.dataset.max) quantity.max = option.dataset.max;
        else quantity.removeAttribute('max');
        quantity.value = quantity.min;
      }
      const button = this.querySelector('[name="add"]');
      const enabled = this.dataset.purchaseEnabled === 'true' && option.dataset.requiresPlan !== 'true';
      const available = option.dataset.available === 'true';
      const planNotice = this.querySelector('.gensen-plan-notice');
      if (planNotice) planNotice.hidden = option.dataset.requiresPlan !== 'true';
      button.disabled = !enabled || !available;
      button.removeAttribute('aria-disabled');
      const label = this.querySelector('[data-submit-label]');
      label.textContent = !enabled ? this.dataset.preparingLabel : available ? this.dataset.addLabel : this.dataset.soldLabel;
      label.classList.remove('hidden');
      const error = this.querySelector('.product-form__error-message-wrapper');
      if (error) error.hidden = true;
      const url = new URL(window.location.href);
      url.searchParams.set('variant', option.value);
      window.history.replaceState({}, '', url);
      if (option.dataset.media) this.showMedia(option.dataset.media);
    }
  });
}
