const themeToggle = document.querySelector('[data-theme-toggle]');
const themeLabel = document.querySelector('[data-theme-label]');
const languageToggle = document.querySelector('[data-language-toggle]');
const languageLabel = document.querySelector('[data-language-label]');
const root = document.body;
const storageKey = 'albert-shi-theme';
const languageStorageKey = 'albert-shi-language';

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
  const nextThemeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  themeToggle?.setAttribute('aria-label', nextThemeLabel);
  themeToggle?.setAttribute('title', nextThemeLabel);
  if (themeLabel) {
    themeLabel.textContent = nextThemeLabel;
  }
}

function applyLanguage(language) {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  const nextLanguageLabel = language === 'zh' ? 'Switch language to English' : '切换到中文';

  document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
    element.textContent = language === 'zh' ? element.dataset.zh : element.dataset.en;
  });

  document.querySelectorAll('[data-en-alt][data-zh-alt]').forEach((element) => {
    element.setAttribute(
      'alt',
      language === 'zh' ? element.dataset.zhAlt ?? '' : element.dataset.enAlt ?? ''
    );
  });

  languageToggle?.setAttribute('aria-pressed', String(language === 'zh'));
  languageToggle?.setAttribute('aria-label', nextLanguageLabel);
  languageToggle?.setAttribute('title', nextLanguageLabel);
  if (languageLabel) {
    languageLabel.textContent = language === 'zh' ? 'CN' : 'EN';
  }
}

function buildSearchUrl(query, baseUrl = 'https://www.google.com/search?q=') {
  return `${baseUrl}${encodeURIComponent(query)}`;
}

function resolveArticleLink(article) {
  const explicitUrl = article.dataset.link?.trim();
  if (explicitUrl) {
    return {
      url: explicitUrl,
      labelEn: 'site',
      labelZh: '主页',
    };
  }

  if (article.closest('.reference-patent-list')) {
    const patentId = article.querySelector('.reference-stamp')?.textContent?.trim();
    if (patentId) {
      return {
        url: `https://patents.google.com/patent/${encodeURIComponent(patentId)}/en`,
        labelEn: 'patent',
        labelZh: '专利',
      };
    }
  }

  const title = article.querySelector('.reference-entry h3')?.textContent?.trim();
  if (!title) {
    return null;
  }

  if (article.closest('.reference-publication-list')) {
    return {
      url: buildSearchUrl(title, 'https://scholar.google.com/scholar?q='),
      labelEn: 'search',
      labelZh: '检索',
    };
  }

  if (
    article.closest('.reference-panel--projects') ||
    article.closest('.reference-panel--service') ||
    article.closest('.reference-panel--awards')
  ) {
    return {
      url: buildSearchUrl(title),
      labelEn: 'search',
      labelZh: '检索',
    };
  }

  return null;
}

function enhanceArticleLinks() {
  document.querySelectorAll('.reference-panel article').forEach((article) => {
    if (article.querySelector('.reference-inline-links a[href]')) {
      return;
    }

    const linkSpec = resolveArticleLink(article);
    if (!linkSpec) {
      return;
    }

    const entry = article.querySelector('.reference-entry');
    if (!entry || entry.querySelector('.reference-item-link')) {
      return;
    }

    const title = entry.querySelector('h3');
    if (!title) {
      return;
    }

    const head = document.createElement('div');
    head.className = 'reference-entry-head';
    entry.insertBefore(head, title);
    head.append(title);

    const link = document.createElement('a');
    link.className = 'reference-item-link';
    link.href = linkSpec.url;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    link.dataset.en = linkSpec.labelEn;
    link.dataset.zh = linkSpec.labelZh;
    link.textContent = document.documentElement.lang.startsWith('zh') ? linkSpec.labelZh : linkSpec.labelEn;

    head.append(link);
  });
}

const savedTheme = localStorage.getItem(storageKey);
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

const savedLanguage = localStorage.getItem(languageStorageKey);
applyLanguage(savedLanguage === 'zh' ? 'zh' : 'en');

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
});

languageToggle?.addEventListener('click', () => {
  const nextLanguage = document.documentElement.lang.startsWith('zh') ? 'en' : 'zh';
  localStorage.setItem(languageStorageKey, nextLanguage);
  applyLanguage(nextLanguage);
});