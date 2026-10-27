(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const num = (id) => Number($(id).value);

  function power(base, exp) {
    if (exp === 0) return 1;
    if (exp < 0) return 1 / power(base, -exp);
    return base * power(base, exp - 1);
  }
  click('[data-act="r1"]', () => show('r1-out', `${num('r1-base')} ^ ${num('r1-exp')} = ${power(num('r1-base'), num('r1-exp'))}`));

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
  }
  click('[data-act="r2"]', () => show('r2-out', `НСД = ${gcd(num('r2-a'), num('r2-b'))}`));

  function maxDigit(n) {
    n = Math.abs(n);
    if (n < 10) return n;
    return Math.max(n % 10, maxDigit(Math.floor(n / 10)));
  }
  click('[data-act="r3"]', () => show('r3-out', `Максимальна цифра: ${maxDigit(num('r3-n'))}`));

  function isPrime(n, divisor = 2) {
    if (n < 2) return false;
    if (divisor * divisor > n) return true;
    if (n % divisor === 0) return false;
    return isPrime(n, divisor + 1);
  }
  click('[data-act="r4"]', () => {
    const n = num('r4-n');
    show('r4-out', `${n} — ${isPrime(n) ? 'просте' : 'не просте'} число`);
  });

  function factors(n, divisor = 2, acc = []) {
    if (n === 1) return acc;
    if (n % divisor === 0) return factors(n / divisor, divisor, [...acc, divisor]);
    return factors(n, divisor + 1, acc);
  }
  click('[data-act="r5"]', () => {
    const n = num('r5-n');
    const f = factors(n);
    show('r5-out', `${n} = ${f.join(' × ')}`);
  });

  function fib(n) {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
  }
  click('[data-act="r6"]', () => show('r6-out', `Число Фібоначчі №${num('r6-n')} = ${fib(num('r6-n'))}`));
})();
