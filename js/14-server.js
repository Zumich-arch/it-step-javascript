(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);

  const NETWORK_BLOCKED_MSG = 'Запит заблоковано CSP цього перегляду. Відкрийте завантажені файли сайту в окремому браузері.';

  // ---- 1. fetchAdviceByKeyword — XMLHttpRequest ----
  function fetchAdviceByKeyword(keyword) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.adviceslip.com/advice/search/${encodeURIComponent(keyword)}`);
    xhr.onload = () => {
      if (xhr.status !== 200) return show('s1-out', `Помилка сервера: ${xhr.status}`, false);
      try {
        const data = JSON.parse(xhr.responseText);
        const slips = data.slips;
        if (!slips || !slips.length) return show('s1-out', 'Нічого не знайдено', false);
        show('s1-out', slips.map(s => `• ${s.advice}`).join('\n'));
      } catch (e) {
        show('s1-out', 'Не вдалося розпарсити відповідь сервера', false);
      }
    };
    xhr.onerror = () => show('s1-out', NETWORK_BLOCKED_MSG, false);
    xhr.send();
  }
  click('[data-act="s1"]', () => { show('s1-out', 'Шукаю…'); fetchAdviceByKeyword($('s1-kw').value.trim()); });

  // ---- 2. fetchDogBreeds — XMLHttpRequest ----
  function fetchDogBreeds() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dog.ceo/api/breeds/list/all');
    xhr.onload = () => {
      const list = $('breed-list');
      list.innerHTML = '';
      if (xhr.status !== 200) {
        const li = document.createElement('li'); li.textContent = `Помилка: ${xhr.status}`; list.appendChild(li);
        return;
      }
      try {
        const data = JSON.parse(xhr.responseText);
        Object.keys(data.message).forEach(breed => {
          const li = document.createElement('li');
          li.textContent = breed;
          list.appendChild(li);
        });
      } catch (e) {
        console.error('Не вдалося розпарсити список порід', e);
      }
    };
    xhr.onerror = () => {
      const list = $('breed-list');
      list.innerHTML = '';
      const li = document.createElement('li'); li.textContent = NETWORK_BLOCKED_MSG; li.style.color = 'var(--danger)';
      list.appendChild(li);
    };
    xhr.send();
  }
  click('[data-act="s2"]', fetchDogBreeds);

  // ---- 3. fetchRandomQuote — fetch ----
  async function fetchRandomQuote() {
    const box = $('quote-container');
    box.textContent = 'Завантаження…';
    try {
      const res = await fetch('https://api.api-ninjas.com/v1/quotes', {
        headers: { 'X-Api-Key': $('s3-key').value.trim() }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const q = data[0];
      box.textContent = `«${q.quote}» — ${q.author}`;
    } catch (err) {
      console.error(err);
      box.textContent = NETWORK_BLOCKED_MSG;
    }
  }
  click('[data-act="s3"]', fetchRandomQuote);

  // ---- 4. fetchCountryByName — fetch ----
  async function fetchCountryByName(name) {
    const box = $('country-info');
    box.textContent = 'Завантаження…';
    try {
      // restcountries тепер вимагає явно перелічити fields, інакше віддає 400 —
      // довго не міг зрозуміти, чому запит падає, поки не почитав їхній changelog
      const fields = 'name,capital,region,population,flag';
      const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=${fields}`);
      if (res.status === 404) { box.textContent = 'Країна не знайдена'; return; }
      if (!res.ok) throw new Error(`сервер відповів ${res.status}`);
      const data = await res.json();
      const c = Array.isArray(data) ? data[0] : data;
      if (!c) { box.textContent = 'Країна не знайдена'; return; }
      box.innerHTML = '';
      const line = (label, value) => { const p = document.createElement('div'); p.textContent = `${label}: ${value}`; return p; };
      box.appendChild(line('Назва', c.name.common));
      box.appendChild(line('Столиця', (c.capital || []).join(', ') || '—'));
      box.appendChild(line('Регіон', c.region));
      box.appendChild(line('Населення', c.population.toLocaleString('uk-UA')));
      const flag = document.createElement('div');
      flag.textContent = `Прапор: ${c.flag || ''}`;
      box.appendChild(flag);
    } catch (err) {
      box.textContent = err instanceof TypeError ? NETWORK_BLOCKED_MSG : `Країна не знайдена (${err.message})`;
    }
  }
  click('[data-act="s4"]', () => fetchCountryByName($('s4-name').value.trim()));
})();
