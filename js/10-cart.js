(() => {
  const $ = (id) => document.getElementById(id);

  const products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Phone', price: 800 },
    { id: 3, name: 'Headphones', price: 200 },
  ];
  /** @type {{productId:number, qty:number}[]} */
  const cart = [];

  function renderProducts(filterText = '') {
    const wrap = $('c-products');
    wrap.innerHTML = '';
    const q = filterText.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'output';
      empty.textContent = 'Нічого не знайдено';
      wrap.appendChild(empty);
      return;
    }
    for (const product of filtered) {
      const card = document.createElement('div');
      card.className = 'product-card';

      const title = document.createElement('strong');
      title.textContent = product.name; // textContent — без innerHTML

      const price = document.createElement('span');
      price.className = 'mono';
      price.style.color = 'var(--text-muted)';
      price.textContent = `$${product.price}`;

      const btn = document.createElement('button');
      btn.textContent = 'Add to cart';
      btn.dataset.productId = String(product.id);
      btn.addEventListener('click', () => addToCart(product.id)); // без inline onclick

      card.append(title, price, btn);
      wrap.appendChild(card);
    }
  }

  function addToCart(productId) {
    const line = cart.find(l => l.productId === productId);
    if (line) line.qty += 1;
    else cart.push({ productId, qty: 1 });
    renderCart();
  }
  function removeFromCart(productId) {
    const idx = cart.findIndex(l => l.productId === productId);
    if (idx === -1) return;
    cart.splice(idx, 1);
    renderCart();
  }
  function emptyCart() {
    cart.length = 0;
    renderCart();
  }

  function renderCart() {
    const list = $('c-list');
    list.innerHTML = '';
    let totalQty = 0, totalSum = 0;

    if (!cart.length) {
      const empty = document.createElement('li');
      empty.textContent = 'Кошик порожній';
      empty.style.color = 'var(--text-muted)';
      list.appendChild(empty);
    }

    for (const line of cart) {
      const product = products.find(p => p.id === line.productId);
      totalQty += line.qty;
      totalSum += line.qty * product.price;

      const li = document.createElement('li');
      li.className = 'goal-row';
      const text = document.createElement('span');
      text.className = 'goal-text';
      text.textContent = `${product.name} × ${line.qty} = $${line.qty * product.price}`;
      const remove = document.createElement('button');
      remove.className = 'danger small';
      remove.type = 'button';
      remove.textContent = 'Прибрати';
      remove.dataset.productId = String(product.id);
      remove.addEventListener('click', () => removeFromCart(product.id));
      li.append(text, remove);
      list.appendChild(li);
    }

    $('c-summary').textContent = `Товарів у кошику: ${totalQty} · Разом: $${totalSum}`;
  }

  $('c-search').addEventListener('input', (e) => renderProducts(e.target.value));
  $('c-empty').addEventListener('click', emptyCart);
  $('c-dark-toggle').addEventListener('click', () => $('cart-shell').classList.toggle('dark-scope'));

  renderProducts();
  renderCart();
})();
