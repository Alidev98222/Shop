/* Madino Store — Cart, wishlist, mini-cart, badges */
(function () {
  const M = window.MADINO_DATA;
  const $ = s => document.querySelector(s);
  const LS = { cart:'madino_cart', wish:'madino_wish', coupon:'madino_coupon' };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };

  let items = load(LS.cart, []);
  let wish = load(LS.wish, []);
  let coupon = localStorage.getItem(LS.coupon) || null;

  function save() {
    localStorage.setItem(LS.cart, JSON.stringify(items));
    localStorage.setItem(LS.wish, JSON.stringify(wish));
    coupon ? localStorage.setItem(LS.coupon, coupon) : localStorage.removeItem(LS.coupon);
  }
  const key = (id, o) => [id, (o && o.color) || '', (o && o.size) || ''].join('|');

  const Cart = {
    items: () => items,
    count: () => items.reduce((s, i) => s + i.qty, 0),
    listSum: () => items.reduce((s, i) => { const p = M.getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0),
    subtotal: () => items.reduce((s, i) => { const p = M.getProduct(i.id); return s + (p ? M.finalPrice(p) * i.qty : 0); }, 0),
    productSavings: () => items.reduce((s, i) => { const p = M.getProduct(i.id); return s + (p ? (p.price - M.finalPrice(p)) * i.qty : 0); }, 0),
    couponValue: () => {
      if (!coupon) return 0;
      const c = M.coupons[coupon];
      if (!c) return 0;
      const st = Cart.subtotal();
      return c.type === 'percent' ? Math.round(st * c.value / 100) : Math.min(c.value, st);
    },
    afterDiscount: () => Math.max(0, Cart.subtotal() - Cart.couponValue()),
    shipping: () => (Cart.count() === 0 || Cart.afterDiscount() >= M.freeShippingThreshold) ? 0 : M.shippingCost,
    total: () => Cart.afterDiscount() + Cart.shipping(),
    add(id, qty, o) {
      const k = key(id, o || {});
      const ex = items.find(i => i.k === k);
      if (ex) ex.qty += qty || 1;
      else items.push({ k: k, id: id, qty: qty || 1, color: (o && o.color) || '', size: (o && o.size) || '' });
      Cart.notify();
    },
    setQty(k, q) {
      const it = items.find(i => i.k === k);
      if (!it) return;
      it.qty = Math.max(1, Math.min(99, q));
      Cart.notify();
    },
    remove(k) { items = items.filter(i => i.k !== k); Cart.notify(); },
    clear() { items = []; coupon = null; Cart.notify(); },
    couponCode: () => coupon,
    applyCoupon(code) {
      code = String(code || '').trim().toUpperCase();
      if (!M.coupons[code]) return { ok:false, msg:'کد تخفیف معتبر نیست' };
      coupon = code; Cart.notify();
      return { ok:true, msg:'کد تخفیف با موفقیت اعمال شد' };
    },
    removeCoupon() { coupon = null; Cart.notify(); },
    isWished: id => wish.includes(id),
    toggleWish(id) {
      const on = !wish.includes(id);
      wish = on ? wish.concat(id) : wish.filter(w => w !== id);
      save(); updateBadges();
      document.dispatchEvent(new Event('wish:change'));
      return on;
    },
    wishList: () => wish.map(M.getProduct).filter(Boolean),
    notify() { save(); updateBadges(); renderMini(); document.dispatchEvent(new Event('cart:change')); }
  };
  window.Cart = Cart;

  /* Badges */
  function updateBadges() {
    const c = $('#cart-count'), w = $('#wish-count');
    if (c) { const n = Cart.count(); c.textContent = M.toFa(n); c.hidden = n === 0; }
    if (w) { const n = wish.length; w.textContent = M.toFa(n); w.hidden = n === 0; }
  }

  /* Mini cart */
  function buildMini() {
    if ($('#mini-cart')) return;
    const d = document.createElement('div');
    d.className = 'mini-cart';
    d.id = 'mini-cart';
    d.setAttribute('aria-label', 'سبد خرید سریع');
    d.innerHTML =
      '<div class="mc-head"><h3>سبد خرید شما</h3><button class="icon-btn" id="mc-close" aria-label="بستن">' + window.icon('x') + '</button></div>' +
      '<div class="mc-items" id="mc-items"></div>' +
      '<div class="mc-foot"><div class="mc-total"><span>مبلغ قابل پرداخت</span><b id="mc-total">—</b></div>' +
      '<div class="mc-actions"><a class="btn btn-outline btn-sm" href="./cart.html">مشاهده سبد</a><a class="btn btn-primary btn-sm" href="./checkout.html">تسویه حساب</a></div></div>';
    document.body.appendChild(d);
    $('#mc-close').addEventListener('click', window.closeOverlay);
  }

  function renderMini() {
    buildMini();
    const box = $('#mc-items');
    if (!box) return;
    if (!items.length) {
      box.innerHTML = '<div class="mc-empty">' + window.icon('cart', 40) + '<p style="margin-top:10px">سبد خرید شما خالی است</p><a class="btn btn-primary btn-sm" style="margin-top:12px" href="./shop.html">شروع خرید</a></div>';
      $('#mc-total').textContent = M.price(0);
      return;
    }
    box.innerHTML = items.map(i => {
      const p = M.getProduct(i.id);
      if (!p) return '';
      const opts = [i.color, i.size].filter(Boolean).join(' / ');
      return '<div class="mc-item"><img src="' + M.img(p) + '" alt=""><span><span class="mi-name" style="display:block;font-size:12.5px;font-weight:600;overflow:hidden;max-height:38px">' + p.name + '</span><span class="mc-qty">' + M.toFa(i.qty) + ' عدد' + (opts ? ' — ' + opts : '') + '</span><span class="mc-price">' + M.price(M.finalPrice(p) * i.qty) + '</span></span><button class="mc-remove" data-mc-remove="' + i.k + '" aria-label="حذف">' + window.icon('trash', 16) + '</button></div>';
    }).join('');
    $('#mc-total').textContent = M.price(Cart.total());
  }

  $('#cart-btn') && $('#cart-btn').addEventListener('click', () => {});
  document.addEventListener('click', e => {
    if (e.target.closest('#cart-btn')) { renderMini(); $('#mini-cart').classList.add('open'); window.openOverlay(); }
    const rm = e.target.closest('[data-mc-remove]');
    if (rm) Cart.remove(rm.dataset.mcRemove);
  });

  /* Global add / wish delegation */
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      Cart.add(add.dataset.add, 1);
      window.showToast('محصول به سبد خرید اضافه شد', 'success');
      return;
    }
    const w = e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault();
      const on = Cart.toggleWish(w.dataset.wish);
      $$('[data-wish="' + w.dataset.wish + '"]').forEach(b => b.classList.toggle('wish-active', on));
      window.showToast(on ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', on ? 'success' : '');
    }
  });

  updateBadges();
  buildMini();
  renderMini();
})();