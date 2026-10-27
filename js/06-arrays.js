(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const num = (id) => Number($(id).value);

  // ---------- 1. Shopping list ----------
  const shoppingList = [
    { name: 'Хліб', qty: 1, bought: false },
    { name: 'Яблука', qty: 6, bought: true },
  ];
  function renderShoppingList() {
    const ul = $('a1-list');
    ul.innerHTML = '';
    const ordered = [...shoppingList.filter(i => !i.bought), ...shoppingList.filter(i => i.bought)];
    if (!ordered.length) {
      const li = document.createElement('li');
      li.textContent = 'Список порожній';
      li.style.color = 'var(--text-muted)';
      ul.appendChild(li);
      return;
    }
    for (const item of ordered) {
      const li = document.createElement('li');
      li.className = 'goal-row' + (item.bought ? ' completed' : '');
      const text = document.createElement('span');
      text.className = 'goal-text';
      text.textContent = `${item.name} — ${item.qty} шт.`;
      li.appendChild(text);
      if (!item.bought) {
        const btn = document.createElement('button');
        btn.className = 'small';
        btn.textContent = 'Купити';
        btn.addEventListener('click', () => { item.bought = true; renderShoppingList(); });
        li.appendChild(btn);
      }
      ul.appendChild(li);
    }
  }
  function addPurchase(name, qty) {
    const existing = shoppingList.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (existing) existing.qty += qty;
    else shoppingList.push({ name, qty, bought: false });
  }
  click('[data-act="a1-add"]', () => {
    const name = $('a1-name').value.trim();
    const qty = num('a1-qty');
    if (!name || qty < 1) return;
    addPurchase(name, qty);
    $('a1-name').value = '';
    renderShoppingList();
  });
  renderShoppingList();

  // ---------- 2. Receipt ----------
  const receipt = [
    { name: 'Кава', qty: 2, price: 95 },
    { name: 'Круасан', qty: 3, price: 42 },
    { name: 'Сік апельсиновий', qty: 1, price: 68 },
  ];
  function renderReceipt() {
    const wrap = $('a2-table');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Товар</th><th>К-сть</th><th>Ціна</th><th>Сума</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (const r of receipt) {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td'); tdName.textContent = r.name;
      const tdQty = document.createElement('td'); tdQty.textContent = r.qty;
      const tdPrice = document.createElement('td'); tdPrice.textContent = r.price.toFixed(2);
      const tdSum = document.createElement('td'); tdSum.textContent = (r.qty * r.price).toFixed(2);
      tr.append(tdName, tdQty, tdPrice, tdSum);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.innerHTML = '';
    wrap.appendChild(table);

    const total = receipt.reduce((s, r) => s + r.qty * r.price, 0);
    const totalQty = receipt.reduce((s, r) => s + r.qty, 0);
    const mostExpensive = receipt.reduce((a, b) => (b.price > a.price ? b : a));
    const avgUnitPrice = total / totalQty;
    show('a2-out', `Разом: ${total.toFixed(2)} · Найдорожча позиція: ${mostExpensive.name} (${mostExpensive.price.toFixed(2)}) · Середня вартість одиниці товару: ${avgUnitPrice.toFixed(2)}`);
  }
  renderReceipt();

  // ---------- 3. CSS styles array ----------
  function buildStyles() {
    return [
      { name: 'color', value: $('a3-color').value },
      { name: 'font-size', value: num('a3-size') + 'px' },
      { name: 'text-align', value: $('a3-align').value },
      { name: 'text-decoration', value: $('a3-underline').value },
      { name: 'display', value: 'block' },
    ];
  }
  click('[data-act="a3"]', () => {
    const styles = buildStyles();
    const styleAttr = styles.map(s => `${s.name}: ${s.value};`).join(' ');
    const text = $('a3-text').value || ' ';

    const preview = $('a3-preview');
    preview.innerHTML = '';
    const span = document.createElement('div');
    styles.forEach(s => span.style.setProperty(s.name, s.value));
    span.textContent = text; // textContent — безпечно, навіть якщо текст ввів користувач
    preview.appendChild(span);

    $('a3-code').textContent = `<div style="${styleAttr}">${text}</div>`;
  });

  // ---------- 4. Auditoriums ----------
  const departments = ['Кафедра ПЗ', 'Кафедра КН', 'Кафедра Математики'];
  const auditoriums = [
    { name: 'Ауд. 101', seats: 12, department: 'Кафедра ПЗ' },
    { name: 'Ауд. 102', seats: 18, department: 'Кафедра ПЗ' },
    { name: 'Ауд. 103', seats: 20, department: 'Кафедра КН' },
    { name: 'Ауд. 201', seats: 10, department: 'Кафедра Математики' },
    { name: 'Ауд. 202', seats: 15, department: 'Кафедра КН' },
    { name: 'Ауд. 203', seats: 11, department: 'Кафедра ПЗ' },
    { name: 'Ауд. 301', seats: 19, department: 'Кафедра Математики' },
    { name: 'Ауд. 302', seats: 16, department: 'Кафедра КН' },
  ];
  for (const sel of [$('a4-dept'), $('a4-group-dept')]) {
    departments.forEach(d => { const o = document.createElement('option'); o.textContent = d; sel.appendChild(o); });
  }
  function renderAuditoriums(list) {
    const wrap = $('a4-out');
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>Назва</th><th>Місць</th><th>Кафедра</th></tr></thead>';
    const tbody = document.createElement('tbody');
    if (!list.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td'); td.colSpan = 3; td.textContent = 'Нічого не знайдено'; td.style.color = 'var(--text-muted)';
      tr.appendChild(td); tbody.appendChild(tr);
    }
    for (const a of list) {
      const tr = document.createElement('tr');
      ['name', 'seats', 'department'].forEach(k => { const td = document.createElement('td'); td.textContent = a[k]; tr.appendChild(td); });
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.innerHTML = '';
    wrap.appendChild(table);
  }
  click('[data-act="a4-all"]', () => renderAuditoriums(auditoriums));
  click('[data-act="a4-dept"]', () => renderAuditoriums(auditoriums.filter(a => a.department === $('a4-dept').value)));
  click('[data-act="a4-seats"]', () => renderAuditoriums([...auditoriums].sort((a, b) => a.seats - b.seats)));
  click('[data-act="a4-name"]', () => renderAuditoriums([...auditoriums].sort((a, b) => a.name.localeCompare(b.name, 'uk'))));
  click('[data-act="a4-group"]', () => {
    const students = num('a4-students');
    const dept = $('a4-group-dept').value;
    const fit = auditoriums.filter(a => a.department === dept && a.seats >= students);
    renderAuditoriums(fit);
  });
  renderAuditoriums(auditoriums);
})();
