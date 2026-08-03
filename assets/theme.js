(function () {
  var KEY = 'mge_public_theme';
  var root = document.documentElement;

  function prefersLight() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function getInitialTheme() {
    try {
      var queryTheme = new URLSearchParams(window.location.search).get('theme');
      if (queryTheme === 'light' || queryTheme === 'dark') return queryTheme;
      var saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return prefersLight() ? 'light' : 'dark';
  }

  function icon(theme) {
    return theme === 'light'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.7A8 8 0 1 1 11.3 3 6.5 6.5 0 0 0 21 12.7z"/></svg>';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.innerHTML = icon(theme);
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('title', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fbf7f2' : '#0c0b12');
  }

  window.MGETheme = {
    set: function (theme) {
      try { localStorage.setItem(KEY, theme); } catch (e) {}
      apply(theme);
    },
    toggle: function () {
      var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      this.set(current === 'light' ? 'dark' : 'light');
    }
  };

  apply(getInitialTheme());

  document.addEventListener('click', function (event) {
    var btn = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (btn) window.MGETheme.toggle();
  });
})();
