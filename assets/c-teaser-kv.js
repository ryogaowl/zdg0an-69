(function () {
  class TeaserKv extends HTMLElement {
    connectedCallback() {
      this.lastWidth = null;
      this.updateHeight = this.updateHeight.bind(this);

      this.updateHeight();
      window.addEventListener('resize', this.updateHeight);
      window.addEventListener('orientationchange', this.updateHeight);
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this.updateHeight);
      window.removeEventListener('orientationchange', this.updateHeight);
    }

    /*
      スマホでスクロールしてアドレスバーが隠れると、ビューポートの高さだけが変わる。
      svh などのビューポート単位のままだと、そのたびにレイアウトが組み直されて
      スクロールが引っかかるため、読み込み時の高さを px で固定してしまう。
      向きを変えたときは測り直す必要があるので、幅が変わったときだけ更新する。
    */
    updateHeight() {
      const width = window.innerWidth;
      if (width === this.lastWidth) return;

      this.lastWidth = width;
      this.style.setProperty('--teaser-kv-viewport-height', `${window.innerHeight}px`);
      this.classList.add('c-teaser-kv--fixed-height');
    }
  }

  if (!customElements.get('teaser-kv')) {
    customElements.define('teaser-kv', TeaserKv);
  }
})();
