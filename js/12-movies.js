(() => {
  const $ = (id) => document.getElementById(id);
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const setStatus = (text, ok = true) => { const el = $('mv-status'); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };

  let currentPage = 1;
  let lastQuery = { title: '', type: '' };

  async function searchMovies(title, type, page) {
    const key = $('mv-key').value.trim();
    const params = new URLSearchParams({ apikey: key, s: title, page: String(page) });
    if (type) params.set('type', type);
    const res = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
    const data = await res.json();
    if (data.Response === 'False') throw new Error(data.Error || 'Movie not found!');
    return data; // { Search: [...], totalResults: "N" }
  }

  async function fetchDetails(imdbID) {
    const key = $('mv-key').value.trim();
    const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&i=${encodeURIComponent(imdbID)}&plot=short`);
    const data = await res.json();
    if (data.Response === 'False') throw new Error(data.Error || 'Not found');
    return data;
  }

  function renderResults(list) {
    const wrap = $('mv-results');
    wrap.innerHTML = '';
    for (const m of list) {
      const card = document.createElement('div');
      card.className = 'product-card';
      const title = document.createElement('strong');
      title.textContent = `${m.Title} (${m.Year})`;
      const meta = document.createElement('span');
      meta.className = 'mono';
      meta.style.color = 'var(--text-muted)';
      meta.textContent = m.Type;
      const btn = document.createElement('button');
      btn.className = 'small';
      btn.textContent = 'Details';
      btn.addEventListener('click', () => showDetails(m.imdbID));
      card.append(title, meta, btn);
      wrap.appendChild(card);
    }
  }

  function renderPager(totalResults, page) {
    const pager = $('mv-pager');
    pager.innerHTML = '';
    const totalPages = Math.ceil(totalResults / 10);
    if (totalPages <= 1) return;
    for (let p = 1; p <= totalPages; p++) {
      const btn = document.createElement('button');
      btn.className = p === page ? '' : 'ghost';
      btn.textContent = String(p);
      btn.addEventListener('click', () => runSearch(p));
      pager.appendChild(btn);
    }
  }

  async function showDetails(imdbID) {
    const box = $('mv-details');
    box.style.display = 'block';
    box.textContent = 'Завантаження…';
    try {
      const d = await fetchDetails(imdbID);
      box.innerHTML = '';
      const h = document.createElement('div');
      h.className = 'ex__title';
      h.textContent = `${d.Title} (${d.Year})`;
      const p = document.createElement('p');
      p.className = 'ex__desc';
      p.textContent = `${d.Plot} · Режисер: ${d.Director} · Рейтинг IMDB: ${d.imdbRating}`;
      box.append(h, p);
    } catch (err) {
      box.textContent = `Не вдалося завантажити деталі: ${err.message}`;
    }
  }

  async function runSearch(page) {
    const title = $('mv-title').value.trim();
    const type = $('mv-type').value;
    if (!title) return setStatus('Введіть назву фільму', false);
    currentPage = page;
    lastQuery = { title, type };
    setStatus('Шукаю…');
    $('mv-results').innerHTML = '';
    $('mv-pager').innerHTML = '';
    $('mv-details').style.display = 'none';
    try {
      const data = await searchMovies(title, type, page);
      setStatus(`Знайдено: ${data.totalResults}`);
      renderResults(data.Search);
      renderPager(Number(data.totalResults), page);
    } catch (err) {
      setStatus(
        err instanceof TypeError
          ? 'Не вдалося достукатись до OMDB — ймовірно, CSP-пісочниця блокує запит тут. Відкрийте завантажені файли сайту в окремому браузері.'
          : err.message === 'Movie not found!' ? 'Movie not found!' : `Помилка: ${err.message}`,
        false
      );
    }
  }

  click('[data-act="mv-search"]', () => runSearch(1));
})();
