const MODE_KEY = 'home-mode';
const revealNodes = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const clockMiniNode = document.getElementById('clock-mini');
const dateLineNode = document.getElementById('date-line');
const titleNode = document.getElementById('typing-title');
const updatesListNode = document.getElementById('updates-list');
const updatesSourceNode = document.getElementById('updates-source');
const modeLabelNode = document.getElementById('mode-label');
const modeButtons = document.querySelectorAll('.mode-btn');

yearNode.textContent = `© ${new Date().getFullYear()} BYzhaoran`;

const setMode = (mode) => {
  document.body.dataset.mode = mode;
  localStorage.setItem(MODE_KEY, mode);
  modeLabelNode.textContent = mode === 'card' ? 'Card' : 'Blog';
  modeButtons.forEach((btn) => {
    const active = btn.dataset.modeTarget === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
};

const savedMode = localStorage.getItem(MODE_KEY);
setMode(savedMode === 'card' ? 'card' : 'blog');

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setMode(btn.dataset.modeTarget);
  });
});

const titleText = '你好，我是 BYzhaoran';
let titleCursor = 0;
const typeTitle = () => {
  titleNode.textContent = titleText.slice(0, titleCursor);
  if (titleCursor < titleText.length) {
    titleCursor += 1;
    setTimeout(typeTitle, 85);
  }
};
typeTitle();

const updateClock = () => {
  const now = new Date();
  const timeText = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  }).format(now);

  const dateText = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Shanghai',
  }).format(now);

  clockMiniNode.textContent = timeText;
  dateLineNode.textContent = `${dateText} · Shanghai`;
};
updateClock();
setInterval(updateClock, 1000);

const renderUpdates = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    updatesListNode.innerHTML = '<li class="loading">暂无更新数据。</li>';
    return;
  }

  updatesListNode.innerHTML = '';
  items.slice(0, 8).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'update-item';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'updates-date';
    dateSpan.textContent = item.date || 'N/A';

    const textSpan = document.createElement('span');
    textSpan.className = 'updates-text';
    textSpan.textContent = item.text || '';

    li.appendChild(dateSpan);
    li.appendChild(textSpan);
    updatesListNode.appendChild(li);
  });
};

const parseUpdatesFromReadme = (markdown) => {
  const bulletPattern = /^\s*[-*]\s*(\d{4}[-/.]\d{1,2}(?:[-/.]\d{1,2})?)\s*[:：-]\s*(.+)$/gm;
  const items = [];
  let match = bulletPattern.exec(markdown);
  while (match) {
    items.push({ date: match[1].replace(/\./g, '-').replace(/\//g, '-'), text: match[2].trim() });
    match = bulletPattern.exec(markdown);
  }

  if (items.length > 0) {
    return items;
  }

  const headingPattern = /^##\s+(.+)$/gm;
  const fallback = [];
  let heading = headingPattern.exec(markdown);
  while (heading && fallback.length < 5) {
    fallback.push({ date: 'README', text: `章节更新: ${heading[1].trim()}` });
    heading = headingPattern.exec(markdown);
  }
  return fallback;
};

const loadUpdates = async () => {
  try {
    const response = await fetch('updates.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('updates.json not found');
    }
    const data = await response.json();
    renderUpdates(data.updates || data);
    updatesSourceNode.textContent = '数据源: updates.json';
    return;
  } catch (_) {
  }

  try {
    const response = await fetch('docs/README.md', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('docs/README.md not found');
    }
    const markdown = await response.text();
    const updates = parseUpdatesFromReadme(markdown);
    renderUpdates(updates);
    updatesSourceNode.textContent = '数据源: docs/README.md';
  } catch (_) {
    updatesListNode.innerHTML = '<li class="loading">更新数据加载失败。</li>';
    updatesSourceNode.textContent = '数据源: unavailable';
  }
};

loadUpdates();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealNodes.forEach((node) => revealObserver.observe(node));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

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
  if (!bg || !noise) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      bg.style.transform = `translateY(${y * 0.05}px)`;
      noise.style.transform = `translateY(${y * 0.08}px)`;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
};

const initCardTilt = () => {
  if (prefersReducedMotion || isCoarsePointer) return;
  const cards = document.querySelectorAll('.layout .glass');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 6;
      const rotX = (0.5 - py) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
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
  const count = isCoarsePointer ? 30 : 52;

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
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 1.9 + 0.4,
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

      if (p.x < -10 || p.x > width + 10) p.vx *= -1;
      if (p.y < -10 || p.y > height + 10) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(57,210,255,0.45)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.22;
          ctx.strokeStyle = `rgba(86,248,178,${alpha})`;
          ctx.lineWidth = 1;
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

initCursorGlow();
initParallaxLayers();
initCardTilt();
initParticleField();
