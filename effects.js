(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const injectFxStyles = () => {
    if (document.getElementById('fx-global-style')) return;
    const style = document.createElement('style');
    style.id = 'fx-global-style';
    style.textContent = `
      #fx-particles {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        opacity: 0.8;
      }
      #cursor-glow {
        position: fixed;
        left: 0;
        top: 0;
        width: 360px;
        height: 360px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        background: radial-gradient(circle, rgba(255,111,216,0.45) 0%, rgba(168,85,247,0.25) 38%, rgba(57,210,255,0.1) 60%, rgba(255,111,216,0) 72%);
        transform: translate(-50%, -50%);
        transition: opacity 200ms ease;
      }
      .fx-tilt {
        will-change: transform;
        transition: transform 180ms ease, box-shadow 220ms ease, border-color 220ms ease;
        transform-style: preserve-3d;
      }
.fx-tilt:hover {
  border-color: rgba(255,111,216,0.45) !important;
  box-shadow: 0 34px 88px rgba(0, 0, 0, 0.58), 0 0 30px rgba(255,111,216,0.3) !important;
}
      @media (max-width: 760px) {
        #fx-particles,
        #cursor-glow {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const ensureFxNodes = () => {
    if (!document.getElementById('fx-particles')) {
      const canvas = document.createElement('canvas');
      canvas.id = 'fx-particles';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }
    if (!document.getElementById('cursor-glow')) {
      const glow = document.createElement('div');
      glow.id = 'cursor-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.prepend(glow);
    }
  };

  const initCursorGlow = () => {
    if (prefersReducedMotion || isCoarsePointer) return;
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    document.addEventListener('pointermove', (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = '1';
    });

    document.addEventListener('pointerleave', () => {
      glow.style.opacity = '0';
    });
  };

  const initParallaxLayers = () => {
    if (prefersReducedMotion) return;
    const bg = document.querySelector('.bg-layer');
    const noise = document.querySelector('.noise-layer');
    if (!bg && !noise) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        if (bg) bg.style.transform = `translateY(${y * 0.09}px)`;
        if (noise) noise.style.transform = `translateY(${y * 0.14}px)`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const initCardTilt = () => {
    if (prefersReducedMotion || isCoarsePointer) return;
    const targets = document.querySelectorAll('.glass, .panel, .card, .repo-item, .hero, .doc-panel, .top');

    targets.forEach((el) => {
      if (el.classList.contains('top-nav')) return;
      if (el.classList.contains('mode-switch')) return;
      el.classList.add('fx-tilt');

      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * 10;
        const rotX = (0.5 - py) * 8;
        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  };

  const initParticleField = () => {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById('fx-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = [];
    let width = 0;
    let height = 0;
    const count = isCoarsePointer ? 55 : 110;
    const maxLink = isCoarsePointer ? 130 : 180;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      r: Math.random() * 2.4 + 0.7,
    });

    resize();
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20 || p.x > width + 20) p.vx *= -1;
        if (p.y < -20 || p.y > height + 20) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,111,216,0.75)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLink) {
            const alpha = (1 - dist / maxLink) * 0.4;
            ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
            ctx.lineWidth = 1.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      window.requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    tick();
  };

  const init = () => {
    if (!document.body) return;
    injectFxStyles();
    ensureFxNodes();
    initCursorGlow();
    initParallaxLayers();
    initCardTilt();
    initParticleField();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
