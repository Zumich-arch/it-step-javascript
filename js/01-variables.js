(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => {
    const el = $(id);
    el.textContent = text;
    el.className = 'output ' + (ok ? 'ok' : 'err');
  };
  const num = (id) => Number($(id).value);

  const CURRENT_YEAR = 2026;
  const USD_TO_EUR = 0.92;
  const FILE_SIZE_MB = 820;

  $('v1')?.querySelector('[data-act="v1"]').addEventListener('click', () => {
    const name = $('v1-name').value.trim();
    if (!name) return show('v1-out', 'Введіть ім\'я', false);
    show('v1-out', `Привіт, ${name}!`);
  });

  $('v2')?.querySelector('[data-act="v2"]').addEventListener('click', () => {
    const birthYear = num('v2-year');
    const age = CURRENT_YEAR - birthYear;
    show('v2-out', `Вам ${age} ${age === 1 ? 'рік' : 'років'} (поточний рік зашито як CURRENT_YEAR = ${CURRENT_YEAR})`);
  });

  $('v3')?.querySelector('[data-act="v3"]').addEventListener('click', () => {
    const side = num('v3-side');
    show('v3-out', `Периметр квадрата: ${side * 4}`);
  });

  $('v4')?.querySelector('[data-act="v4"]').addEventListener('click', () => {
    const r = num('v4-r');
    show('v4-out', `Площа кола: ${(Math.PI * r ** 2).toFixed(2)}`);
  });

  $('v5')?.querySelector('[data-act="v5"]').addEventListener('click', () => {
    const km = num('v5-km');
    const h = num('v5-h');
    show('v5-out', `Потрібна швидкість: ${(km / h).toFixed(1)} км/год`);
  });

  $('v6')?.querySelector('[data-act="v6"]').addEventListener('click', () => {
    const usd = num('v6-usd');
    show('v6-out', `${usd} USD = ${(usd * USD_TO_EUR).toFixed(2)} EUR (курс const USD_TO_EUR = ${USD_TO_EUR})`);
  });

  $('v7')?.querySelector('[data-act="v7"]').addEventListener('click', () => {
    const gb = num('v7-gb');
    const files = Math.floor((gb * 1024) / FILE_SIZE_MB);
    show('v7-out', `Вміститься файлів по 820 МБ: ${files}`);
  });

  $('v8')?.querySelector('[data-act="v8"]').addEventListener('click', () => {
    const wallet = num('v8-wallet');
    const price = num('v8-price');
    const count = Math.floor(wallet / price);
    const change = wallet - count * price;
    show('v8-out', `Можна купити: ${count} шт. Здача: ${change.toFixed(2)}`);
  });

  $('v9')?.querySelector('[data-act="v9"]').addEventListener('click', () => {
    const n = num('v9-num');
    if (n < 100 || n > 999) return show('v9-out', 'Потрібне саме тризначне число', false);
    const d1 = Math.floor(n / 100);
    const d2 = Math.floor((n % 100) / 10);
    const d3 = n % 10;
    const reversed = d3 * 100 + d2 * 10 + d1;
    show('v9-out', `${n} → ${reversed}`);
  });

  $('v10')?.querySelector('[data-act="v10"]').addEventListener('click', () => {
    const n = num('v10-num');
    const parity = n % 2 === 0 ? 'парне' : 'непарне';
    show('v10-out', `${n} — ${parity}`);
  });
})();
