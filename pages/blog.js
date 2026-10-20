(() => {
  const stream = document.querySelector('#posts');
  const count = document.querySelector('#post-count');
  const postsPath = '../docs/posts/';

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const inlineMarkdown = (value) => {
    let html = escapeHtml(value);
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" loading="lazy">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return html;
  };

  const renderMarkdown = (markdown) => {
    const lines = String(markdown).replace(/^---[\s\S]*?---\s*/m, '').replace(/\r\n/g, '\n').split('\n');
    const output = [];
    let code = false;
    let codeLines = [];
    let list = '';
    const closeList = () => { if (list) { output.push(`</${list}>`); list = ''; } };
    const flushCode = () => { output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`); codeLines = []; };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('```')) {
        if (code) { flushCode(); code = false; } else { closeList(); code = true; }
        return;
      }
      if (code) { codeLines.push(line); return; }
      if (!trimmed) { closeList(); return; }
      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) { closeList(); const level = heading[1].length; output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); return; }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { closeList(); output.push('<hr>'); return; }
      const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
      if (unordered) { if (list !== 'ul') { closeList(); output.push('<ul>'); list = 'ul'; } output.push(`<li>${inlineMarkdown(unordered[1])}</li>`); return; }
      const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
      if (ordered) { if (list !== 'ol') { closeList(); output.push('<ol>'); list = 'ol'; } output.push(`<li>${inlineMarkdown(ordered[1])}</li>`); return; }
      if (trimmed.startsWith('>')) { closeList(); output.push(`<blockquote>${inlineMarkdown(trimmed.replace(/^>\s?/, ''))}</blockquote>`); return; }
      closeList();
      output.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    });
    if (code) flushCode();
    closeList();
    return output.join('');
  };

  const getTitle = (markdown, fallback) => {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : fallback;
  };

  const getSummary = (markdown) => {
    const text = markdown.replace(/^---[\s\S]*?---\s*/m, '').split('\n').map((line) => line.trim()).find((line) => line && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith('-'));
    return text ? text.replace(/[\[\]`*_>]/g, '').slice(0, 120) : '打开这篇记录，查看完整工程笔记。';
  };

  const createPost = async (meta, index) => {
    const response = await fetch(`${postsPath}${encodeURIComponent(meta.file)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${meta.file}: ${response.status}`);
    const markdown = await response.text();
    const title = getTitle(markdown, meta.file.replace(/\.[^.]+$/, ''));
    const entry = document.createElement('article');
    entry.className = 'post-entry';
    entry.style.setProperty('--entry-delay', `${Math.min(index * 70, 420)}ms`);
    const cover = meta.cover ? `../assets/anime/wallhaven/${encodeURIComponent(meta.cover)}` : '../assets/koharu/site-header.webp';
    entry.innerHTML = `
      <header class="post-entry-head">
        <div class="post-cover" style="background-image: linear-gradient(135deg, rgba(39,49,68,.12), rgba(39,49,68,.56)), url('${cover}')" aria-hidden="true"></div>
        <div class="post-meta"><span class="post-date">${escapeHtml(meta.date || '未标注日期')}</span><span class="post-category">${escapeHtml(meta.category || 'Engineering Notes')}</span><h2>${escapeHtml(title)}</h2><p class="post-summary">${escapeHtml(getSummary(markdown))}</p></div>
      </header>
      <div class="post-body" hidden>${renderMarkdown(markdown)}</div>
      <div class="post-meta"><button class="post-toggle" type="button"><span class="toggle-closed">阅读全文 ↓</span><span class="toggle-open">收起文章 ↑</span></button></div>`;
    const button = entry.querySelector('.post-toggle');
    const body = entry.querySelector('.post-body');
    button.addEventListener('click', () => {
      const open = body.hidden;
      body.hidden = !open;
      entry.classList.toggle('is-open', open);
      if (open) body.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return entry;
  };

  const load = async () => {
    try {
      const response = await fetch(`${postsPath}index.json`, { cache: 'no-store' });
      if (!response.ok) throw new Error('无法读取 docs/posts/index.json');
      const posts = await response.json();
      posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
      count.textContent = String(posts.length).padStart(2, '0');
      stream.innerHTML = '';
      for (let index = 0; index < posts.length; index += 1) stream.appendChild(await createPost(posts[index], index));
    } catch (error) {
      stream.innerHTML = `<p class="post-error">博客加载失败：${escapeHtml(error.message)}。请确认站点以 HTTP 服务启动，并检查 <code>docs/posts/index.json</code>。</p>`;
      count.textContent = '00';
    }
  };

  load();
})();
