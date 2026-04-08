const revealNodes = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const clockMiniNode = document.getElementById('clock-mini');
const dateLineNode = document.getElementById('date-line');
const titleNode = document.getElementById('typing-title');

yearNode.textContent = `© ${new Date().getFullYear()} BYzhaoran`;

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
