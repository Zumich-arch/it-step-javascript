(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);

  // ---- 1. Marker / RefillableMarker ----
  class Marker {
    constructor(color, ink = 100) { this.color = color; this.ink = ink; }
    print(text) {
      let printed = '';
      for (const ch of text) {
        const cost = ch.trim() === '' ? 0 : 0.5;
        if (this.ink - cost < 0) break;
        this.ink -= cost;
        printed += ch;
      }
      return printed;
    }
  }
  class RefillableMarker extends Marker {
    refill() { this.ink = 100; return this; }
  }
  const marker = new RefillableMarker($('m1-color').value, 100);

  function renderMarkerMeta() {
    show('m1-meta', `Чорнила залишилось: ${marker.ink.toFixed(1)}%`, marker.ink > 0);
  }
  renderMarkerMeta();

  click('[data-act="m1-print"]', () => {
    marker.color = $('m1-color').value;
    const text = $('m1-text').value;
    const before = marker.ink;
    const printed = marker.print(text);
    const out = $('m1-out');
    const span = document.createElement('span');
    span.style.color = marker.color;
    span.style.fontWeight = '600';
    span.textContent = printed || '(чорнило закінчилось одразу)';
    out.innerHTML = '';
    out.appendChild(span);
    if (printed.length < text.length) {
      const note = document.createElement('div');
      note.className = 'note warn';
      note.style.marginTop = '6px';
      note.innerHTML = '<b>Увага:</b> чорнило закінчилось — текст надруковано не повністю.';
      out.appendChild(note);
    }
    renderMarkerMeta();
  });
  click('[data-act="m1-refill"]', () => { marker.refill(); renderMarkerMeta(); });

  // ---- 2. ExtendedDate ----
  class ExtendedDate extends Date {
    toTextDate() {
      const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
      return `${this.getDate()} ${months[this.getMonth()]} ${this.getFullYear()}`;
    }
    isFutureOrToday() {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const self = new Date(this.getFullYear(), this.getMonth(), this.getDate());
      return self >= today;
    }
    isLeapYear() {
      const y = this.getFullYear();
      return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    }
    nextDate() {
      const d = new ExtendedDate(this.getFullYear(), this.getMonth(), this.getDate() + 1);
      return d;
    }
  }
  const dateInput = $('m2-date');
  dateInput.value = new Date().toISOString().slice(0, 10);
  function readDate() {
    const [y, m, d] = dateInput.value.split('-').map(Number);
    return new ExtendedDate(y, m - 1, d);
  }
  click('[data-act="m2-text"]', () => show('m2-out', readDate().toTextDate()));
  click('[data-act="m2-future"]', () => show('m2-out', readDate().isFutureOrToday() ? 'true — дата сьогоднішня або майбутня' : 'false — дата вже минула'));
  click('[data-act="m2-leap"]', () => { const d = readDate(); show('m2-out', `${d.getFullYear()} рік ${d.isLeapYear() ? 'високосний' : 'не високосний'}`); });
  click('[data-act="m2-next"]', () => show('m2-out', `Наступна дата: ${readDate().nextDate().toTextDate()}`));

  // ---- 3–4. Employee / EmpTable / StyledEmpTable ----
  class Employee {
    constructor(name, position, salary) { this.name = name; this.position = position; this.salary = salary; }
  }
  class EmpTable {
    constructor(employees) { this.employees = employees; }
    getHtml() {
      const rows = this.employees
        .map(e => `<tr><td>${e.name}</td><td>${e.position}</td><td>${e.salary.toLocaleString('uk-UA')}</td></tr>`)
        .join('');
      return `<table><thead><tr><th>Ім'я</th><th>Посада</th><th>Оклад</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
  }
  class StyledEmpTable extends EmpTable {
    getStyles() {
      return '<style>.emp-table{border-collapse:collapse;width:100%;font-size:13.5px}' +
        '.emp-table th,.emp-table td{border:1px solid rgba(128,128,128,.4);padding:7px 10px;text-align:left}' +
        '.emp-table th{background:rgba(128,128,128,.12);font-family:ui-monospace,monospace;font-size:11px;text-transform:uppercase}</style>';
    }
    getHtml() {
      return this.getStyles() + super.getHtml().replace('<table>', '<table class="emp-table">');
    }
  }
  const bankEmployees = [
    new Employee('Ірина Коваль', 'Операціоніст', 22000),
    new Employee('Олег Бондар', 'Кредитний менеджер', 28500),
    new Employee('Марія Шевчук', 'Керівник відділення', 41000),
    new Employee('Дмитро Савчук', 'Аналітик ризиків', 33000),
  ];
  click('[data-act="m3"]', () => {
    const table = new StyledEmpTable(bankEmployees);
    const code = table.getHtml();
    $('m3-preview').innerHTML = code;
    $('m3-code').textContent = code;
  });
})();
