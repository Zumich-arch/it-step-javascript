(() => {
  const $ = (id) => document.getElementById(id);
  const show = (id, text, ok = true) => { const el = $(id); el.textContent = text; el.className = 'output ' + (ok ? 'ok' : 'err'); };
  const click = (sel, fn) => document.querySelector(sel)?.addEventListener('click', fn);
  const num = (id) => Number($(id).value);

  // ---- Task 1: Circle ----
  class Circle {
    #radius;
    constructor(radius) { this.radius = radius; }
    get radius() { return this.#radius; }
    set radius(value) { this.#radius = value; }
    get diameter() { return this.#radius * 2; }
    area() { return Math.PI * this.#radius ** 2; }
    circumference() { return 2 * Math.PI * this.#radius; }
  }
  click('[data-act="h1"]', () => {
    const c = new Circle(num('h1-r'));
    show('h1-out', `radius=${c.radius} · diameter=${c.diameter} · area=${c.area().toFixed(2)} · circumference=${c.circumference().toFixed(2)}`);
  });

  // ---- Tasks 2–4: HtmlElement, CssClass, HtmlBlock ----
  class HtmlElement {
    constructor(tagName, selfClosing = false) {
      this.tagName = tagName;
      this.selfClosing = selfClosing;
      this.text = '';
      this.attributes = [];
      this.styles = [];
      this.children = [];
    }
    setAttribute(name, value) {
      const existing = this.attributes.find(a => a.name === name);
      if (existing) existing.value = value; else this.attributes.push({ name, value });
      return this;
    }
    setStyle(name, value) { this.styles.push({ name, value }); return this; }
    setText(text) { this.text = text; return this; }
    appendChild(el) { this.children.push(el); return this; }
    prependChild(el) { this.children.unshift(el); return this; }
    getHtml() {
      const attrs = this.attributes.map(a => ` ${a.name}="${a.value}"`).join('');
      const styleAttr = this.styles.length ? ` style="${this.styles.map(s => `${s.name}: ${s.value};`).join(' ')}"` : '';
      if (this.selfClosing) return `<${this.tagName}${attrs}${styleAttr}>`;
      const childrenHtml = this.children.map(c => c.getHtml()).join('');
      return `<${this.tagName}${attrs}${styleAttr}>${this.text}${childrenHtml}</${this.tagName}>`;
    }
  }

  class CssClass {
    constructor(className) { this.className = className; this.styles = []; }
    setStyle(name, value) {
      const existing = this.styles.find(s => s.name === name);
      if (existing) existing.value = value; else this.styles.push({ name, value });
      return this;
    }
    removeStyle(name) { this.styles = this.styles.filter(s => s.name !== name); return this; }
    getCss() {
      const body = this.styles.map(s => `  ${s.name}: ${s.value};`).join('\n');
      return `.${this.className} {\n${body}\n}`;
    }
  }

  class HtmlBlock {
    constructor(root) { this.root = root; this.cssClasses = []; }
    addClass(cssClass) { this.cssClasses.push(cssClass); return this; }
    getCode() {
      const styleTag = `<style>\n${this.cssClasses.map(c => c.getCss()).join('\n')}\n</style>`;
      return `${styleTag}\n${this.root.getHtml()}`;
    }
  }

  click('[data-act="h2"]', () => {
    const wrap = new CssClass('demo-wrap').setStyle('display', 'flex').setStyle('gap', '12px').setStyle('flex-wrap', 'wrap');
    const block = new CssClass('demo-block').setStyle('width', '220px').setStyle('margin', '0');
    const imgClass = new CssClass('demo-img').setStyle('width', '100%').setStyle('border-radius', '6px');
    const textClass = new CssClass('demo-text').setStyle('text-align', 'justify').setStyle('font-size', '12.5px');

    const placeholderSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="160"><rect width="300" height="160" fill="#d7dedb"/><text x="150" y="84" font-family="sans-serif" font-size="14" fill="#5b6965" text-anchor="middle">lipsum.jpg</text></svg>'
    );
    function makeCard() {
      const h3 = new HtmlElement('h3').setText('What is Lorem Ipsum?');
      const img = new HtmlElement('img', true)
        .setAttribute('class', 'demo-img')
        .setAttribute('src', placeholderSvg)
        .setAttribute('alt', 'Lorem Ipsum');
      const link = new HtmlElement('a').setAttribute('href', 'https://www.lipsum.com/').setAttribute('target', '_blank').setText('More...');
      const p = new HtmlElement('p').setAttribute('class', 'demo-text')
        .setText('"Lorem Ipsum is simply dummy text of the printing and typesetting industry." ')
        .appendChild(link);
      const card = new HtmlElement('div').setAttribute('class', 'demo-block');
      card.appendChild(h3).appendChild(img).appendChild(p);
      return card;
    }

    const wrapper = new HtmlElement('div').setAttribute('id', 'wrapper').setAttribute('class', 'demo-wrap');
    wrapper.appendChild(makeCard()).appendChild(makeCard());

    const htmlBlock = new HtmlBlock(wrapper).addClass(wrap).addClass(block).addClass(imgClass).addClass(textClass);
    const code = htmlBlock.getCode();

    $('h2-preview').innerHTML = code; // код повністю згенеровано власними класами — безпечно вставляти
    $('h2-code').textContent = code;
  });
})();
