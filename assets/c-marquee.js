(function () {
  /* 画像間の余白（px）。CSS ではなく Splide の gap で制御する */
  const GAP = 40;
  const SP_BREAKPOINT = 767;
  const SPLIDE_WAIT_TIMEOUT = 10000;

  function whenSplideReady() {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();

      const check = () => {
        if (
          window.Splide &&
          window.splide &&
          window.splide.Extensions &&
          window.splide.Extensions.AutoScroll
        ) {
          resolve();
        } else if (Date.now() - startedAt > SPLIDE_WAIT_TIMEOUT) {
          reject(new Error("Splide を読み込めませんでした。"));
        } else {
          setTimeout(check, 50);
        }
      };

      check();
    });
  }

  class MarqueeBanner extends HTMLElement {
    connectedCallback() {
      this.handleResize = this.handleResize.bind(this);

      whenSplideReady()
        .then(() => {
          if (!this.isConnected || this.splide) return;

          this.initSplide();

          this.resizeObserver = new ResizeObserver(this.handleResize);
          this.resizeObserver.observe(this);
          /* 画像の読み込み完了で各スライドの幅が確定するため、再計算する */
          window.addEventListener("load", this.handleResize);
        })
        .catch((error) => {
          console.warn("[c-marquee]", error.message);
        });
    }

    disconnectedCallback() {
      this.resizeObserver?.disconnect();
      window.removeEventListener("load", this.handleResize);
      clearTimeout(this.resizeTimer);
      this.destroySplide();
    }

    initSplide() {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const autoScroll = {
        speed: this.getSpeed("speedPc"),
        pauseOnHover: false,
        pauseOnFocus: false,
        autoStart: !reducedMotion,
      };

      this.cloneCount = this.computeCloneCount();
      this.splide = new window.Splide(this, {
        type: "loop",
        autoWidth: true,
        gap: `${GAP}px`,
        clones: this.cloneCount,
        arrows: false,
        pagination: false,
        drag: "free",
        autoScroll: autoScroll,
        breakpoints: {
          [SP_BREAKPOINT]: {
            autoScroll: { speed: this.getSpeed("speedSp") },
            gap: `14px`,
          },
        },
      });

      this.splide.mount(window.splide.Extensions);
    }

    destroySplide() {
      if (!this.splide) return;
      this.splide.destroy(true);
      this.splide = null;
    }

    /* テーマ設定は 1〜50 の整数。Splide の速度（1フレームあたりの移動量）に換算する */
    getSpeed(key) {
      const value = parseFloat(this.dataset[key]);
      return Number.isFinite(value) && value > 0 ? value / 10 : 1;
    }

    /*
      autoWidth では Splide が生成するクローンがスライド1周分のみとなり、
      画像の合計幅が画面幅より狭いと隙間ができるため、必要な周回数を自前で求める。
    */
    computeCloneCount() {
      const slides = this.querySelectorAll(
        ".splide__slide:not(.splide__slide--clone)"
      );
      if (!slides.length) return 0;

      let setWidth = 0;
      slides.forEach((slide) => {
        setWidth += slide.getBoundingClientRect().width + GAP;
      });

      if (setWidth <= 0) return slides.length;

      const repeats = Math.ceil(this.clientWidth / setWidth) + 1;
      return repeats * slides.length;
    }

    handleResize() {
      clearTimeout(this.resizeTimer);

      this.resizeTimer = setTimeout(() => {
        if (!this.splide) return;

        const cloneCount = this.computeCloneCount();
        if (cloneCount === this.cloneCount) return;

        this.destroySplide();
        this.initSplide();
      }, 200);
    }
  }

  if (!customElements.get("marquee-banner")) {
    customElements.define("marquee-banner", MarqueeBanner);
  }
})();
