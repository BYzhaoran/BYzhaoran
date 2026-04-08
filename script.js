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
    const response = await fetch('README.md', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('README.md not found');
    }
    const markdown = await response.text();
    const updates = parseUpdatesFromReadme(markdown);
    renderUpdates(updates);
    updatesSourceNode.textContent = '数据源: README.md';
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
