window.LearningSchedule = (() => {
  const REPO_BASE = "https://github.com/BYzhaoran/Learning_Schedule";
  const REPO_BLOB = `${REPO_BASE}/blob/master/`;
  const REPO_RAW = "https://raw.githubusercontent.com/BYzhaoran/Learning_Schedule/master/";

  const toBlobLink = (relativePath) => `${REPO_BLOB}${relativePath}`;
  const toRawLink = (relativePath) => `${REPO_RAW}${relativePath}`;

  const setMarkedOptions = () => {
    if (!window.marked) {
      return;
    }
    window.marked.setOptions({
      gfm: true,
      breaks: true,
      mangle: false,
      headerIds: false,
    });
  };

  const normalizeLinks = (root) => {
    const links = root.querySelectorAll("a[href]");
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
        return;
      }
      const normalized = href.replace(/^\.\//, "").replace(/^\//, "");
      a.href = toBlobLink(normalized);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  };

  const renderMarkdownTo = async ({ rootId, markdownPath, sourceLabel }) => {
    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    setMarkedOptions();

    try {
      const response = await fetch(toRawLink(markdownPath), { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load markdown");
      }
      const markdown = await response.text();
      const html = window.marked ? window.marked.parse(markdown) : `<pre>${markdown}</pre>`;
      root.innerHTML = `<p class="meta">来源：${sourceLabel || markdownPath}</p>${html}`;
      normalizeLinks(root);
    } catch (_) {
      root.innerHTML = `<p class="status">内容加载失败，请稍后重试。<a href="${toBlobLink(markdownPath)}" target="_blank" rel="noopener noreferrer">查看仓库原文</a></p>`;
    }
  };

  return {
    toBlobLink,
    toRawLink,
    renderMarkdownTo,
  };
})();
