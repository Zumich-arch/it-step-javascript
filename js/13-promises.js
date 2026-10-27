(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const parseArr = (id) => $(id).value.split(',').map(s => s.trim()).filter(s => s !== '');
  const parseNums = (id) => parseArr(id).map(Number);

  // ---- 1. processArray ----
  function processArray(array, callback) { return array.map(callback); }
  const doubleElement = (el) => el * 2;
  const reverseElement = (el) => String(el).split('').reverse().join('');
  click('[data-act="p1"]', () => {
    const cb = $('p1-cb').value === 'double' ? doubleElement : reverseElement;
    const input = $('p1-cb').value === 'double' ? parseNums('p1-arr') : parseArr('p1-arr');
    show('p1-out', `[${processArray(input, cb).join(', ')}]`);
  });

  // ---- 2. filterArray ----
  function filterArray(array, callback) { return array.filter(callback); }
  const isEven = (n) => Number(n) % 2 === 0;
  const isShortWord = (w) => String(w).length <= 4;
  click('[data-act="p2"]', () => {
    const useNums = $('p2-cb').value === 'even';
    const input = useNums ? parseNums('p2-arr') : parseArr('p2-arr');
    const cb = useNums ? isEven : isShortWord;
    show('p2-out', `[${filterArray(input, cb).join(', ')}]`);
  });

  // ---- 3. chained promises ----
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  function washDishes() { return wait(2000).then(() => 'Посуд вимито'); }
  function cleanRoom() { return wait(4000).then(() => 'Кімнату прибрано'); }
  function makeDinner() { return wait(7000).then(() => 'Вечеря приготована'); }
  click('[data-act="p3"]', () => {
    const log = [];
    const btn = document.querySelector('[data-act="p3"]');
    btn.disabled = true;
    show('p3-out', 'Починаємо…');
    washDishes()
      .then(msg => { log.push(msg); show('p3-out', log.join('\n')); return cleanRoom(); })
      .then(msg => { log.push(msg); show('p3-out', log.join('\n')); return makeDinner(); })
      .then(msg => { log.push(msg); show('p3-out', log.join('\n') + '\n\nУсі справи зроблено!'); })
      .finally(() => { btn.disabled = false; });
  });

  // ---- 4. sortArray ----
  function sortArray(array) {
    return new Promise((resolve, reject) => {
      if (array.length === 0) return reject('Масив порожній');
      setTimeout(() => resolve([...array].sort((a, b) => a - b)), 2000);
    });
  }
  click('[data-act="p4"]', () => {
    const arr = parseNums('p4-arr');
    show('p4-out', 'Сортую…');
    sortArray(arr)
      .then(sorted => show('p4-out', `[${sorted.join(', ')}]`))
      .catch(err => show('p4-out', String(err), false));
  });

  // ---- 5. multiplyAsync ----
  function multiplyAsync(a, b) {
    return new Promise((resolve, reject) => {
      if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a) || Number.isNaN(b)) {
        reject(new Error('Некоректні значення'));
        return;
      }
      setTimeout(() => resolve(a * b), 2000);
    });
  }
  click('[data-act="p5"]', async () => {
    show('p5-out', 'Рахую…');
    const a = Number($('p5-a').value), b = Number($('p5-b').value);
    try {
      const result = await multiplyAsync(a, b);
      show('p5-out', `${a} × ${b} = ${result}`);
    } catch (err) {
      show('p5-out', err.message, false);
    }
  });

  // ---- 6. sortArrayAsync ----
  function sortArrayAsync(array) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (array.length === 0) { reject(new Error('Масив порожній')); return; }
        resolve([...array].sort((a, b) => a - b));
      }, 2000);
    });
  }
  click('[data-act="p6"]', async () => {
    show('p6-out', 'Сортую…');
    try {
      const sorted = await sortArrayAsync(parseNums('p6-arr'));
      show('p6-out', `[${sorted.join(', ')}]`);
    } catch (err) {
      show('p6-out', err.message, false);
    }
  });
})();
