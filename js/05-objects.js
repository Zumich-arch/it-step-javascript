(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const num = (id) => Number($(id).value);

  // ---- 1. Car ----
  function makeCar(manufacturer, model, year, avgSpeed) {
    return {
      manufacturer, model, year, avgSpeed,
      printInfo() { return `${this.manufacturer} ${this.model}, ${this.year} рік, середня швидкість ${this.avgSpeed} км/год`; },
      travelTime(distance) {
        const driveHours = distance / this.avgSpeed;
        let breaks = Math.floor(driveHours / 4);
        if (driveHours % 4 === 0 && breaks > 0) breaks -= 1; // доїхали рівно на позначці — перерва вже не потрібна
        const total = driveHours + breaks;
        return { driveHours, breaks, total };
      }
    };
  }
  click('[data-act="o1-info"]', () => {
    const car = makeCar($('o1-make').value, $('o1-model').value, num('o1-year'), num('o1-speed'));
    show('o1-out', car.printInfo());
  });
  click('[data-act="o1-time"]', () => {
    const car = makeCar($('o1-make').value, $('o1-model').value, num('o1-year'), num('o1-speed'));
    const { driveHours, breaks, total } = car.travelTime(num('o1-dist'));
    show('o1-out', `Чистий час у дорозі: ${driveHours.toFixed(2)} год. Перерв (по 1 год кожні 4 год): ${breaks}. Разом: ${total.toFixed(2)} год.`);
  });

  // ---- 2. Fraction ----
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); return b === 0 ? a || 1 : gcd(b, a % b); }
  function makeFraction(num, den) { return { num, den }; }
  const add = (f1, f2) => makeFraction(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
  const sub = (f1, f2) => makeFraction(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
  const mul = (f1, f2) => makeFraction(f1.num * f2.num, f1.den * f2.den);
  const divide = (f1, f2) => makeFraction(f1.num * f2.den, f1.den * f2.num);
  function simplify(f) {
    const g = gcd(f.num, f.den);
    let n = f.num / g, d = f.den / g;
    if (d < 0) { n = -n; d = -d; }
    return makeFraction(n, d);
  }
  click('[data-act="o2"]', () => {
    const f1 = makeFraction(num('o2-n1'), num('o2-d1'));
    const f2 = makeFraction(num('o2-n2'), num('o2-d2'));
    if (f1.den === 0 || f2.den === 0) return show('o2-out', 'Знаменник не може бути 0', false);
    const op = $('o2-op').value;
    const fn = { add, sub, mul, div: divide }[op];
    const result = fn(f1, f2);
    if (result.den === 0) return show('o2-out', 'Ділення на нуль', false);
    const simplified = simplify(result);
    show('o2-out', `Результат: ${result.num}/${result.den}  →  скорочено: ${simplified.num}/${simplified.den}`);
  });

  // ---- 3. Time ----
  function makeTime(h, m, s) {
    return {
      h, m, s,
      display() {
        const pad = (v) => String(v).padStart(2, '0');
        return `${pad(this.h)}:${pad(this.m)}:${pad(this.s)}`;
      },
      addSeconds(n) {
        let total = this.h * 3600 + this.m * 60 + this.s + n;
        total = ((total % 86400) + 86400) % 86400;
        this.h = Math.floor(total / 3600);
        this.m = Math.floor((total % 3600) / 60);
        this.s = total % 60;
        return this;
      },
      addMinutes(n) { return this.addSeconds(n * 60); },
      addHours(n) { return this.addSeconds(n * 3600); }
    };
  }
  let time = makeTime(num('o3-h'), num('o3-m'), num('o3-s'));
  click('[data-act="o3-show"]', () => {
    time = makeTime(num('o3-h'), num('o3-m'), num('o3-s'));
    show('o3-out', `Час: ${time.display()}`);
  });
  click('[data-act="o3-add-s"]', () => { time.addSeconds(num('o3-add-s')); show('o3-out', `+${num('o3-add-s')} сек → ${time.display()}`); });
  click('[data-act="o3-add-m"]', () => { time.addMinutes(num('o3-add-m')); show('o3-out', `+${num('o3-add-m')} хв → ${time.display()}`); });
  click('[data-act="o3-add-h"]', () => { time.addHours(num('o3-add-h')); show('o3-out', `+${num('o3-add-h')} год → ${time.display()}`); });
})();
