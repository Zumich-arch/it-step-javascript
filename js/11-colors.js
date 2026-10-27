(() => {
  const $ = (id) => document.getElementById(id);
  const COOKIE_NAME = 'hw-colors';
  const MAX_AGE_SECONDS = 3 * 60 * 60; // 3 години

  function readCookie(name) {
    try {
      const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
      if (!match) return null;
      return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
    } catch (e) { return null; }
  }
  function writeCookie(name, value) {
    try {
      document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; max-age=${MAX_AGE_SECONDS}; path=/; samesite=lax`;
    } catch (e) { /* cookie недоступне (пісочниця перегляду) — колекція житиме лише до перезавантаження */ }
  }

  let colors = readCookie(COOKIE_NAME) || [];

  const valuePlaceholders = {
    RGB: { label: 'Код (R, G, B)', placeholder: '255, 99, 71' },
    RGBA: { label: 'Код (R, G, B, A)', placeholder: '255, 99, 71, 0.8' },
    HEX: { label: 'Код (#RRGGBB)', placeholder: '#FF6347' },
  };
  function updateValueHint() {
    const t = $('col-type').value;
    $('col-value-label').textContent = valuePlaceholders[t].label;
    $('col-value').placeholder = valuePlaceholders[t].placeholder;
  }
  $('col-type').addEventListener('change', updateValueHint);
  updateValueHint();

  function validateName(name) {
    if (!name) return "Назва обов'язкова";
    if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(name)) return 'Назва — тільки літери, без цифр і пробілів';
    if (colors.some(c => c.name.toLowerCase() === name.toLowerCase())) return 'Такий колір вже є в списку';
    return null;
  }
  function validateValue(type, value) {
    if (type === 'RGB') {
      const parts = value.split(',').map(s => s.trim());
      if (parts.length !== 3 || parts.some(p => !/^\d+$/.test(p))) return 'RGB — 3 числа через кому';
      if (parts.some(p => Number(p) < 0 || Number(p) > 255)) return 'Кожне число RGB — від 0 до 255';
      return null;
    }
    if (type === 'RGBA') {
      const parts = value.split(',').map(s => s.trim());
      if (parts.length !== 4) return 'RGBA — 4 числа через кому';
      const [r, g, b, a] = parts;
      if (![r, g, b].every(p => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255)) return 'Перші 3 числа RGBA — від 0 до 255';
      if (!/^(0(\.\d+)?|1(\.0+)?)$/.test(a)) return 'Останнє число RGBA — від 0 до 1';
      return null;
    }
    if (type === 'HEX') {
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'HEX — символ # і 6 цифр/літер A-F';
      return null;
    }
    return 'Невідомий тип';
  }
  function toCssColor(type, value) {
    if (type === 'RGB') return `rgb(${value})`;
    if (type === 'RGBA') return `rgba(${value})`;
    return value;
  }

  function render() {
    const list = $('col-list');
    list.innerHTML = '';
    if (!colors.length) {
      const empty = document.createElement('li');
      empty.textContent = 'Палітра порожня — додайте перший колір';
      empty.style.color = 'var(--text-muted)';
      list.appendChild(empty);
      return;
    }
    for (const c of colors) {
      const li = document.createElement('li');
      li.className = 'swatch-row';
      const dot = document.createElement('span');
      dot.className = 'swatch-dot';
      dot.style.background = toCssColor(c.type, c.value);
      const label = document.createElement('span');
      label.style.flex = '1';
      label.textContent = `${c.name} · ${c.type} · ${c.value}`;
      const del = document.createElement('button');
      del.className = 'danger small';
      del.type = 'button';
      del.textContent = 'Видалити';
      del.addEventListener('click', () => {
        colors = colors.filter(x => x !== c);
        writeCookie(COOKIE_NAME, colors);
        render();
      });
      li.append(dot, label, del);
      list.appendChild(li);
    }
  }

  $('col-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('col-name').value.trim();
    const type = $('col-type').value;
    const value = $('col-value').value.trim();
    const errorBox = $('col-error');

    const nameErr = validateName(name);
    const valueErr = !nameErr ? validateValue(type, value) : null;
    const err = nameErr || valueErr;
    if (err) {
      errorBox.textContent = err;
      errorBox.style.display = 'block';
      return;
    }
    errorBox.style.display = 'none';
    colors.push({ name, type, value });
    writeCookie(COOKIE_NAME, colors);
    $('col-name').value = '';
    $('col-value').value = '';
    render();
  });

  render();
})();
