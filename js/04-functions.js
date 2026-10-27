(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const num = (id) => Number($(id).value);

  function compare(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
  click('[data-act="f1"]', () => {
    const r = compare(num('f1-a'), num('f1-b'));
    show('f1-out', `compare(${num('f1-a')}, ${num('f1-b')}) = ${r}`);
  });

  function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }
  click('[data-act="f2"]', () => {
    const n = num('f2-n');
    if (n < 0) return show('f2-out', "Факторіал від'ємного числа не існує", false);
    show('f2-out', `${n}! = ${factorial(n)}`);
  });

  function digitsToNumber(d1, d2, d3) { return Number(`${d1}${d2}${d3}`); }
  click('[data-act="f3"]', () => {
    show('f3-out', `Число: ${digitsToNumber(num('f3-d1'), num('f3-d2'), num('f3-d3'))}`);
  });

  function area(length, width = length) { return length * width; }
  click('[data-act="f4"]', () => {
    const w = $('f4-h').value === '' ? undefined : num('f4-h');
    const l = num('f4-w');
    const s = area(l, w);
    show('f4-out', w === undefined ? `Квадрат зі стороною ${l}: площа = ${s}` : `Прямокутник ${l}×${w}: площа = ${s}`);
  });

  function isPerfect(n) {
    if (n < 2) return false;
    let sum = 0;
    for (let i = 1; i <= n / 2; i++) if (n % i === 0) sum += i;
    return sum === n;
  }
  click('[data-act="f5"]', () => {
    const n = num('f5-n');
    show('f5-out', `${n} — ${isPerfect(n) ? 'досконале' : 'не досконале'} число`);
  });

  click('[data-act="f6"]', () => {
    const min = num('f6-min'), max = num('f6-max');
    if (max < min) return show('f6-out', '«До» має бути не менше за «Від»', false);
    if (max - min > 200000) return show('f6-out', 'Задайте діапазон не більше 200 000 — браузер не встигне порахувати', false);
    const found = [];
    for (let i = min; i <= max; i++) if (isPerfect(i)) found.push(i);
    show('f6-out', found.length ? `Досконалі числа: ${found.join(', ')}` : 'У цьому діапазоні досконалих чисел немає');
  });
})();
