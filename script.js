const themeToggles = Array.from(document.querySelectorAll('[data-theme-toggle]'));
const themeLabels = Array.from(document.querySelectorAll('[data-theme-label]'));
const languageToggles = Array.from(document.querySelectorAll('[data-language-toggle]'));
const languageLabels = Array.from(document.querySelectorAll('[data-language-label]'));
const sectionLinks = Array.from(document.querySelectorAll('[data-section-link]'));
const root = document.body;
const storageKey = 'albert-shi-theme';
const languageStorageKey = 'albert-shi-language';

function applyTheme(theme) {
  root.dataset.theme = theme;
  const nextThemeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  themeToggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.setAttribute('aria-label', nextThemeLabel);
    toggle.setAttribute('title', nextThemeLabel);
  });
  themeLabels.forEach((label) => {
    label.textContent = nextThemeLabel;
  });
}

function applyLanguage(language) {
  const isChinese = language === 'zh';
  document.documentElement.lang = isChinese ? 'zh-CN' : 'en';
  root.dataset.language = language;
  const nextLanguageLabel = isChinese ? 'Switch language to English' : '切换到中文';

  document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
    element.textContent = isChinese ? element.dataset.zh ?? '' : element.dataset.en ?? '';
  });

  document.querySelectorAll('[data-en-alt][data-zh-alt]').forEach((element) => {
    element.setAttribute(
      'alt',
      isChinese ? element.dataset.zhAlt ?? '' : element.dataset.enAlt ?? ''
    );
  });

  document.querySelectorAll('.lang-en').forEach((element) => {
    element.hidden = isChinese;
  });

  document.querySelectorAll('.lang-zh').forEach((element) => {
    element.hidden = !isChinese;
  });

  languageToggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(isChinese));
    toggle.setAttribute('aria-label', nextLanguageLabel);
    toggle.setAttribute('title', nextLanguageLabel);
  });

  languageLabels.forEach((label) => {
    label.textContent = isChinese ? 'EN' : '中文';
  });
}

function updateActiveSection() {
  if (!sectionLinks.length) {
    return;
  }

  const threshold = window.scrollY + 140;
  let activeHref = sectionLinks[0].getAttribute('href');

  sectionLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target && target.offsetTop <= threshold) {
      activeHref = link.getAttribute('href');
    }
  });

  sectionLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === activeHref);
  });
}

function installImageFallbacks() {
  document.querySelectorAll('img[data-fallback-src]').forEach((image) => {
    const applyFallback = () => {
      const fallbackSrc = image.dataset.fallbackSrc;
      if (!fallbackSrc) {
        return;
      }

      const fallbackUrl = new URL(fallbackSrc, window.location.href).href;
      if (image.currentSrc === fallbackUrl || image.src === fallbackUrl) {
        return;
      }

      image.src = fallbackSrc;
    };

    image.addEventListener('error', applyFallback);

    if (image.complete && image.naturalWidth === 0) {
      applyFallback();
    }
  });
}

function installPublicationFilters() {
  const filterButtons = Array.from(document.querySelectorAll('[data-publication-filter]'));
  const publicationItems = Array.from(document.querySelectorAll('[data-publication-groups]'));

  if (!filterButtons.length || !publicationItems.length) {
    return;
  }

  const applyPublicationFilter = (filter) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.publicationFilter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    publicationItems.forEach((item) => {
      const groups = (item.dataset.publicationGroups ?? '').split(/\s+/).filter(Boolean);
      item.hidden = !groups.includes(filter);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyPublicationFilter(button.dataset.publicationFilter ?? 'selected');
    });
  });

  applyPublicationFilter('selected');
}

const savedTheme = localStorage.getItem(storageKey);
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

const savedLanguage = localStorage.getItem(languageStorageKey);
applyLanguage(savedLanguage === 'zh' ? 'zh' : 'en');

installImageFallbacks();
installPublicationFilters();

themeToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
});

languageToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const nextLanguage = document.documentElement.lang.startsWith('zh') ? 'en' : 'zh';
    localStorage.setItem(languageStorageKey, nextLanguage);
    applyLanguage(nextLanguage);
  });
});

window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
window.addEventListener('load', updateActiveSection);
updateActiveSection();