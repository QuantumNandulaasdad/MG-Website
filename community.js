/* Giscus discussion for the public MG article. No visitor tracking. */
(() => {
  'use strict';
  const button = document.querySelector('[data-mg-open]');
  const note = document.querySelector('[data-mg-status]');
  const thread = document.querySelector('[data-mg-thread]');
  if (!button || !note || !thread) return;
  if (location.origin !== 'https://quantumnandulaasdad.github.io' ||
      !/^\/MG-Website\/(?:index\.html)?$/.test(location.pathname)) {
    note.textContent = 'Comments are available on the published article.';
    return;
  }

  async function configure() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('comments-config.html', {
        cache: 'no-cache', credentials: 'omit', signal: controller.signal
      });
      if (!response.ok) throw Error('Configuration unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const config = doc.querySelector('script[src="https://giscus.app/client.js"]');
      const repo = config?.getAttribute('data-repo');
      const repoId = config?.getAttribute('data-repo-id');
      const category = config?.getAttribute('data-category');
      const categoryId = config?.getAttribute('data-category-id');
      const validId = value => typeof value === 'string' && /^[A-Za-z0-9_=-]{6,200}$/.test(value);
      if (repo !== 'quantumnandulaasdad/MG-Website' || !validId(repoId) || !validId(categoryId) || !category) {
        note.textContent = 'Comments are not open yet.';
        return;
      }
      button.hidden = false;
      note.textContent = 'Read the discussion here. Sign in with GitHub to post a comment.';
      button.addEventListener('click', () => {
        button.hidden = true;
        button.disabled = true;
        note.textContent = 'Loading comments…';
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.crossOrigin = 'anonymous';
        script.async = true;
        const attrs = {
          'data-repo': repo, 'data-repo-id': repoId,
          'data-category': category, 'data-category-id': categoryId,
          'data-mapping': 'specific', 'data-term': 'Signal story of Myasthenia Gravis',
          'data-strict': '0', 'data-reactions-enabled': '1',
          'data-emit-metadata': '0', 'data-input-position': 'bottom',
          'data-theme': 'purple_dark', 'data-lang': 'en'
        };
        for (const [name, value] of Object.entries(attrs)) script.setAttribute(name, value);
        let frameTimer;
        const unavailable = () => {
          note.textContent = 'Comments could not load. Reload this page to try again.';
          clearTimeout(frameTimer);
          observer.disconnect();
        };
        const observer = new MutationObserver(() => {
          const frame = thread.querySelector('iframe.giscus-frame');
          if (frame) {
            frame.title = 'Questions and comments about myasthenia gravis';
            note.textContent = 'Sign in with GitHub to join the discussion.';
            clearTimeout(frameTimer);
            observer.disconnect();
          }
        });
        observer.observe(thread, {childList: true, subtree: true});
        frameTimer = setTimeout(unavailable, 15000);
        script.onerror = unavailable;
        thread.append(script);
      }, {once: true});
    } catch {
      note.textContent = 'Comments are currently unavailable. The article and game remain available.';
    } finally {
      clearTimeout(timer);
    }
  }
  configure();
})();
