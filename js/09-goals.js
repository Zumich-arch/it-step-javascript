(() => {
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = 'hw-goals';

  let goals = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) goals = JSON.parse(raw);
  } catch (e) { /* localStorage недоступний (приватний режим тощо) — працюємо без збереження */ }
  if (!Array.isArray(goals) || !goals.length) {
    goals = [
      { id: 1, text: 'Вивчити DOM', completed: true },
      { id: 2, text: 'Зробити перший сайт', completed: true },
      { id: 3, text: 'Прочитати книгу', completed: false },
      { id: 4, text: 'Пробігти 5 км', completed: false },
    ];
  }
  let nextId = Math.max(0, ...goals.map(g => g.id)) + 1;
  let filter = 'all';

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)); } catch (e) {}
  }

  function render() {
    const list = $('g-list');
    list.innerHTML = '';

    const visible = goals.filter(g => filter === 'all' ? true : filter === 'active' ? !g.completed : g.completed);

    if (!visible.length) {
      const empty = document.createElement('li');
      empty.textContent = goals.length ? 'У цьому фільтрі цілей немає' : 'Поки що цілей немає';
      empty.style.color = 'var(--text-muted)';
      empty.style.padding = '8px 2px';
      list.appendChild(empty);
    }

    for (const goal of visible) {
      const li = document.createElement('li');
      li.className = 'goal-row' + (goal.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = goal.completed;
      checkbox.setAttribute('aria-label', 'Відмітити ціль виконаною');
      checkbox.addEventListener('change', () => {
        goal.completed = checkbox.checked;
        persist();
        render();
      });

      const text = document.createElement('span');
      text.className = 'goal-text';
      text.textContent = goal.text; // textContent — безпечно для будь-якого введеного тексту

      const del = document.createElement('button');
      del.className = 'danger small';
      del.type = 'button';
      del.textContent = 'Видалити';
      del.addEventListener('click', () => {
        goals = goals.filter(g => g.id !== goal.id);
        persist();
        render();
      });

      li.append(checkbox, text, del);
      list.appendChild(li);
    }

    const total = goals.length;
    const done = goals.filter(g => g.completed).length;
    $('g-stats').textContent = `Усього: ${total}. Виконано: ${done}.`;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { filter = btn.dataset.filter; render(); });
  });

  $('g-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('g-input');
    const errorBox = $('g-error');
    const text = input.value.trim();

    if (text.length < 3 || text.length > 100) {
      errorBox.textContent = `Текст цілі має містити від 3 до 100 символів (зараз: ${text.length})`;
      errorBox.style.display = 'block';
      return;
    }
    errorBox.style.display = 'none';

    goals.push({ id: nextId++, text, completed: false });
    persist();
    input.value = '';
    input.focus();
    render();
  });

  render();
})();
