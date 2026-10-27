(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => {
    const el = $(id);
    el.textContent = text;
    el.className = 'output ' + (ok ? 'ok' : 'err');
  };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const num = (id) => Number($(id).value);

  // 1. sum in range — FOR
  click('[data-act="l1"]', () => {
    let a = num('l1-a'), b = num('l1-b');
    if (a > b) [a, b] = [b, a];
    let sum = 0;
    for (let i = a; i <= b; i++) sum += i;
    show('l1-out', `Сума чисел від ${a} до ${b}: ${sum}`);
  });

  // 2. GCD — WHILE (Euclid)
  click('[data-act="l2"]', () => {
    let a = Math.abs(num('l2-a')), b = Math.abs(num('l2-b'));
    const orig = `${a}, ${b}`;
    while (b !== 0) { [a, b] = [b, a % b]; }
    show('l2-out', `НСД(${orig}) = ${a}`);
  });

  // 3. divisors — FOR
  click('[data-act="l3"]', () => {
    const n = num('l3-n');
    if (n < 1) return show('l3-out', 'Введіть натуральне число', false);
    const divisors = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) divisors.push(i);
    show('l3-out', `Дільники ${n}: ${divisors.join(', ')}`);
  });

  // 4. digit count — DO...WHILE
  click('[data-act="l4"]', () => {
    let n = Math.abs(num('l4-n'));
    let count = 0;
    do { count++; n = Math.floor(n / 10); } while (n > 0);
    show('l4-out', `Цифр у числі: ${count}`);
  });

  // 5. stats of 10 numbers — FOR, one reused variable
  click('[data-act="l5"]', () => {
    const parts = $('l5-nums').value.trim().split(/[\s,]+/).filter(Boolean);
    if (parts.length !== 10) return show('l5-out', `Потрібно рівно 10 чисел, введено ${parts.length}`, false);
    let positive = 0, negative = 0, zero = 0, even = 0, odd = 0;
    let current; // єдина змінна-буфер на всі 10 чисел
    for (let i = 0; i < 10; i++) {
      current = Number(parts[i]);
      if (current > 0) positive++; else if (current < 0) negative++; else zero++;
      if (current % 2 === 0) even++; else odd++;
    }
    show('l5-out', `Додатних: ${positive} · Від'ємних: ${negative} · Нулів: ${zero} · Парних: ${even} · Непарних: ${odd}`);
  });

  // 6. looping calculator — DO...WHILE (each submit = one iteration of "do")
  const l6log = [];
  click('[data-act="l6"]', () => {
    const a = num('l6-a'), op = $('l6-op').value, b = num('l6-b');
    let result;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? NaN : a / b; break;
    }
    l6log.push(`${a} ${op} ${b} = ${Number.isNaN(result) ? 'помилка (ділення на 0)' : result}`);
    show('l6-out', l6log.join('\n') + '\n\nБажаєте розв\'язати ще один приклад? Заповніть поля й натисніть «= Розв\'язати» знову, або «Відмовитись».');
  });
  click('[data-act="l6-clear"]', () => { l6log.length = 0; show('l6-out', 'Гру завершено. Скільки прикладів розв\'язано: ' + l6log.length); });

  // 7. digit shift — FOR, k single-position rotations
  click('[data-act="l7"]', () => {
    let str = String(Math.trunc(num('l7-n')));
    const k = Math.max(0, Math.trunc(num('l7-k'))) % str.length;
    for (let i = 0; i < k; i++) str = str.slice(1) + str[0];
    show('l7-out', `Результат зсуву: ${str}`);
  });

  // 8. weekday loop — WHILE(true) driven by clicks
  const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];
  let dayIdx = -1;
  click('[data-act="l8"]', (e) => {
    dayIdx = (dayIdx + 1) % 7;
    show('l8-out', `${days[dayIdx]}. Бажаєте побачити назву наступного дня тижня?`);
  });
  click('[data-act="l8-stop"]', () => { dayIdx = -1; show('l8-out', 'Цикл зупинено користувачем.'); });

  // 9. multiplication table — nested FOR
  click('[data-act="l9"]', () => {
    let rows = '';
    for (let n = 2; n <= 9; n++) {
      let row = [];
      for (let i = 1; i <= 10; i++) row.push(`${n}×${i}=${n * i}`);
      rows += row.join('  ') + '\n';
    }
    show('l9-out', rows.trim());
  });

  // 10. guess the number — WHILE (binary search), driven by clicks
  let lo = 0, hi = 100, secret = null;
  const l10 = ['l10-less', 'l10-more', 'l10-eq'].map(a => document.querySelector(`[data-act="${a}"]`));
  function setGuessButtons(enabled) { l10.forEach(b => b.disabled = !enabled); }
  click('[data-act="l10-start"]', () => {
    lo = 0; hi = 100;
    secret = Math.floor(Math.random() * 101);
    const n = Math.floor((lo + hi) / 2);
    setGuessButtons(true);
    show('l10-out', `Я загадав число від 0 до 100 (чесно, навіть від себе не ховаю 😉 — секрет: ${secret}, лише для демонстрації).\nВаше число > ${n}, < ${n} чи == ${n}?`);
    document.querySelector('[data-act="l10-start"]').textContent = 'Загадати заново';
  });
  function guessStep(cmp) {
    const n = Math.floor((lo + hi) / 2);
    if (cmp === 'eq') {
      setGuessButtons(false);
      show('l10-out', `Вгадано: ${n}! Діапазон звузили до однієї точки.`);
      return;
    }
    if (cmp === 'more') lo = n + 1; else hi = n - 1;
    if (lo > hi) { setGuessButtons(false); return show('l10-out', 'Діапазон спорожнів — така відповідь не узгоджується з попередніми.', false); }
    const next = Math.floor((lo + hi) / 2);
    show('l10-out', `Діапазон: ${lo}–${hi}. Ваше число > ${next}, < ${next} чи == ${next}?`);
  }
  click('[data-act="l10-less"]', () => guessStep('less'));
  click('[data-act="l10-more"]', () => guessStep('more'));
  click('[data-act="l10-eq"]', () => guessStep('eq'));
})();
