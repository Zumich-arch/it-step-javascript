(() => {
  const rail = document.getElementById('rail');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menuBtn');
  const openRail = () => { rail.classList.add('open'); scrim.classList.add('show'); };
  const closeRail = () => { rail.classList.remove('open'); scrim.classList.remove('show'); };
  menuBtn?.addEventListener('click', () => rail.classList.contains('open') ? closeRail() : openRail());
  scrim?.addEventListener('click', closeRail);
  document.querySelectorAll('.rail__link').forEach(a => a.addEventListener('click', closeRail));

  // theme toggle: cycles system -> light -> dark -> system
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const order = ['system', 'light', 'dark'];
  function applyTheme(mode) {
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    if (themeBtn) themeBtn.textContent = (mode === 'system' ? 'Тема: авто' : mode === 'light' ? 'Тема: світла' : 'Тема: темна');
  }
  let saved = 'system';
  try { saved = localStorage.getItem('hw-theme') || 'system'; } catch (e) {}
  applyTheme(saved);
  themeBtn?.addEventListener('click', () => {
    const next = order[(order.indexOf(saved) + 1) % order.length];
    saved = next;
    applyTheme(next);
    try { localStorage.setItem('hw-theme', next); } catch (e) {}
  });

  // active link highlight via IntersectionObserver
  const links = Array.from(document.querySelectorAll('.rail__link'));
  const sections = links
    .map(l => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);
  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  };
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }
  if (location.hash) setActive(location.hash.slice(1));

  // lazy-load real source of each chapter into its "Показати код" panel
  document.querySelectorAll('details.code-panel[data-code-src]').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open || details.dataset.loaded) return;
      const pre = details.querySelector('pre');
      fetch(details.dataset.codeSrc)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(text => { pre.textContent = text; details.dataset.loaded = '1'; })
        .catch(() => { pre.textContent = 'Не вдалося завантажити файл ' + details.dataset.codeSrc + '.'; });
    });
  });
})();
