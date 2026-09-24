/* Madino Store — Page controllers (home, shop, product, cart, checkout, ...) */
(function () {
  const M = window.MADINO_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const icon = window.icon;
  const page = document.body.dataset.page || '';
  const qs = new URLSearchParams(location.search);
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
  };

  /* ---------- Shared product card ---------- */
  window.productCard = function (p, list) {
    const wished = window.Cart && Cart.isWished(p.id);
    return '<article class="product-card ' + (list ? 'h-list' : '') + '" data-id="' + p.id + '">' +
      '<a class="pc-img" href="./product.html?id=' + p.id + '"><img src="' + M.img(p) + '" alt="' + p.name + '" loading="lazy">' +
        '<span class="pc-badges">' + (p.discount ? '<span class="badge badge-off">٪' + M.toFa(p.discount) + '</span>' : '') + (p.isNew ? '<span class="badge badge-new">جدید</span>' : '') + '</span></a>' +
      '<span class="pc-actions">' +
        '<button class="' + (wished ? 'wish-active' : '') + '" data-wish="' + p.id + '" aria-label="علاقه‌مندی">' + icon('heart', 17) + '</button>' +
        '<a href="./product.html?id=' + p.id + '" aria-label="مشاهده محصول">' + icon('eye', 17) + '</a>' +
      '</span>' +
      '<a class="pc-title" href="./product.html?id=' + p.id + '">' + p.name + '</a>' +
      '<span class="pc-rating">' + icon('star', 14) + '<span>' + M.toFa(p.rating) + '</span><small>(' + M.toFa(p.reviewsCount) + ' نظر)</small></span>' +
      '<span class="pc-foot"><span class="pc-price">' + (p.discount ? '<span class="price-old">' + M.price(p.price) + '</span>' : '') + '<span class="price-now">' + M.price(M.finalPrice(p)) + '</span></span>' +
      '<button class="pc-cart-btn" data-add="' + p.id + '" aria-label="افزودن به سبد خرید"' + (p.stock === 0 ? ' disabled' : '') + '>' + icon('cart', 18) + '</button></span>' +
    '</article>';
  };
  function renderGrid(el, list, listMode) { el.innerHTML = list.map(p => productCard(p, listMode)).join(''); }

  /* ---------- HOME ---------- */
  function initHome() {
    const S = M.heroSlides;
    $('#hero-slider').innerHTML = S.map((s, i) =>
      '<div class="slide ' + (i === 0 ? 'active' : '') + '"><img src="https://picsum.photos/seed/' + s.seed + '/1600/700" alt="' + s.title + '">' +
      '<div class="slide-content"><span class="slide-tag">' + s.tag + '</span><h2>' + s.title + '</h2><p>' + s.text + '</p><a class="btn btn-light" href="' + s.link + '">' + s.cta + '</a></div></div>'
    ).join('');
    $('#hero-dots').innerHTML = S.map((_, i) => '<button class="dot ' + (i === 0 ? 'active' : '') + '" data-i="' + i + '" aria-label="اسلاید ' + M.toFa(i + 1) + '"></button>').join('');
    let cur = 0, timer;
    const go = i => { cur = (i + S.length) % S.length; $$('.slide').forEach((el, j) => el.classList.toggle('active', j === cur)); $$('#hero-dots .dot').forEach((el, j) => el.classList.toggle('active', j === cur)); };
    const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
    $('#hero-next').addEventListener('click', () => { go(cur + 1); auto(); });
    $('#hero-prev').addEventListener('click', () => { go(cur - 1); auto(); });
    $$('#hero-dots .dot').forEach(d => d.addEventListener('click', () => { go(+d.dataset.i); auto(); }));
    auto();

    $('#features-row').innerHTML = M.features.map(f => '<div class="feature">' + icon(f.icon, 30) + '<span><h4>' + f.title + '</h4><p>' + f.text + '</p></span></div>').join('');
    $('#cat-grid').innerHTML = M.categories.map(c => '<a class="cat-card" href="./shop.html?cat=' + c.id + '"><img src="' + c.img + '" alt="' + c.name + '" loading="lazy"><span>' + c.name + '</span></a>').join('');

    const offers = M.products.filter(p => p.discount >= 14).sort((a, b) => b.discount - a.discount).slice(0, 8);
    $('#offers-track').innerHTML = offers.map(p => {
      const pct = Math.min(95, Math.max(35, Math.round(p.sold / 18)));
      return '<a class="offer-card" href="./product.html?id=' + p.id + '"><img src="' + M.img(p) + '" alt="' + p.name + '" loading="lazy"><span class="badge badge-off" style="align-self:flex-start">٪' + M.toFa(p.discount) + '</span><span class="offer-name">' + p.name + '</span><span class="offer-price">' + M.price(M.finalPrice(p)) + '</span>' + (p.discount ? '<span class="offer-old">' + M.price(p.price) + '</span>' : '') + '<span class="stock-bar"><i style="width:' + pct + '%"></i></span><span class="stock-txt">' + M.toFa(pct) + '٪ فروش رفته</span></a>';
    }).join('');
    const track = $('#offers-track');
    $('#offers-next').addEventListener('click', () => track.scrollBy({ left: -420, behavior: 'smooth' }));
    $('#offers-prev').addEventListener('click', () => track.scrollBy({ left: 420, behavior: 'smooth' }));

    function cd() {
      const now = new Date(), end = new Date(now); end.setHours(23, 59, 59, 999);
      let s = Math.max(0, Math.floor((end - now) / 1000));
      const h = Math.floor(s / 3600); s %= 3600;
      const m = Math.floor(s / 60); s %= 60;
      const pad = n => M.toFa(String(n).padStart(2, '0'));
      $('#cd-h').textContent = pad(h); $('#cd-m').textContent = pad(m); $('#cd-s').textContent = pad(s);
    }
    cd(); setInterval(cd, 1000);

    const tabs = { best: p => p.sort((a, b) => b.sold - a.sold), new: p => p.slice().sort((a, b) => b.added - a.added), top: p => p.slice().sort((a, b) => b.rating - a.rating) };
    function fillTab(k) {
      const arr = tabs[k](M.products.slice()).slice(0, 8);
      arr[1].isNew = true; arr[3].isNew = true;
      renderGrid($('#featured-grid'), arr);
    }
    $$('#home-tabs .tab').forEach(t => t.addEventListener('click', () => {
      $$('#home-tabs .tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      fillTab(t.dataset.tab);
    }));
    fillTab('best');

    const brands = [...new Set(M.products.map(p => p.brand))].slice(0, 14);
    $('#brands-row').innerHTML = brands.map(b => '<a class="brand-chip" href="./shop.html?q=' + encodeURIComponent(b) + '">' + b + '</a>').join('');
    $('#testi-grid').innerHTML = M.testimonials.map(t =>
      '<div class="testi-card">' + icon('star', 16) + '<div class="testi-head"><img src="https://picsum.photos/seed/' + t.seed + '/100/100" alt="' + t.name + '" loading="lazy"><span><h4>' + t.name + '</h4><p>' + t.role + '</p></span></div><p>' + t.text + '</p></div>'
    ).join('');

    $('#newsletter-form').addEventListener('submit', e => { e.preventDefault(); window.showToast('عضویت شما در خبرنامه ثبت شد', 'success'); e.target.reset(); });
  }

  /* ---------- SHOP ---------- */
  function initShop() {
    const st = { q: qs.get('q') || '', cat: qs.get('cat') || '', brands: new Set(), min: null, max: null, avail: false, rating: 0, sort: 'bestselling', pg: 1, view: 'grid' };
    const perPage = 9;
    const grid = $('#shop-grid');

    function renderFilters() {
      const cats = M.categories.map(c => ({ c: c, n: M.products.filter(p => p.category === c.id).length }));
      $('#cat-list').innerHTML = '<label class="check-row"><input type="radio" name="f-cat" value="" ' + (st.cat === '' ? 'checked' : '') + '> همه دسته‌ها (' + M.toFa(M.products.length) + ')</label>' +
        cats.map(o => '<label class="check-row"><input type="radio" name="f-cat" value="' + o.c.id + '" ' + (st.cat === o.c.id ? 'checked' : '') + '> ' + o.c.name + ' (' + M.toFa(o.n) + ')</label>').join('');
      const brands = [...new Set(M.products.map(p => p.brand))].sort();
      $('#brand-list').innerHTML = brands.map(b => '<label class="check-row"><input type="checkbox" value="' + b + '" ' + (st.brands.has(b) ? 'checked' : '') + '> ' + b + '</label>').join('');
    }

    function filtered() {
      let l = M.products.slice();
      if (st.q) l = l.filter(p => p.name.includes(st.q) || p.brand.includes(st.q));
      if (st.cat) l = l.filter(p => p.category === st.cat);
      if (st.brands.size) l = l.filter(p => st.brands.has(p.brand));
      if (st.min != null) l = l.filter(p => M.finalPrice(p) >= st.min);
      if (st.max != null) l = l.filter(p => M.finalPrice(p) <= st.max);
      if (st.avail) l = l.filter(p => p.stock > 0);
      if (st.rating) l = l.filter(p => p.rating >= st.rating);
      const S = { bestselling: (a, b) => b.sold - a.sold, newest: (a, b) => b.added - a.added, popular: (a, b) => b.rating - a.rating, cheap: (a, b) => M.finalPrice(a) - M.finalPrice(b), expensive: (a, b) => M.finalPrice(b) - M.finalPrice(a) };
      return l.sort(S[st.sort]);
    }

    function chips() {
      const ch = [];
      const chip = (label, k) => ch.push('<button class="chip" data-chip="' + k + '">' + label + ' ' + icon('x', 12) + '</button>');
      if (st.q) chip('جستجو: ' + st.q, 'q');
      if (st.cat) chip(M.catName(st.cat), 'cat');
      st.brands.forEach(b => chip(b, 'brand|' + b));
      if (st.min != null || st.max != null) chip('قیمت سفارشی', 'price');
      if (st.avail) chip('فقط موجود', 'avail');
      if (st.rating) chip('امتیاز ' + M.toFa(st.rating) + '+', 'rating');
      $('#chips').innerHTML = ch.join('');
    }

    function apply() {
      const l = filtered();
      const pages = Math.max(1, Math.ceil(l.length / perPage));
      st.pg = Math.min(st.pg, pages);
      const slice = l.slice((st.pg - 1) * perPage, st.pg * perPage);
      renderGrid(grid, slice, st.view === 'list');
      $('#result-count').textContent = M.toFa(l.length) + ' کالا';
      $('#shop-subtitle').textContent = st.q ? 'نتایج جستجو برای «' + st.q + '»' : (st.cat ? M.catName(st.cat) : 'همه محصولات در یک نگاه');
      $('#shop-empty').hidden = l.length > 0;
      grid.style.display = l.length ? '' : 'none';
      chips();
      let pg = '<button class="page-btn" data-pg="prev" ' + (st.pg === 1 ? 'disabled' : '') + '>›</button>';
      for (let i = 1; i <= pages; i++) pg += '<button class="page-btn ' + (i === st.pg ? 'active' : '') + '" data-pg="' + i + '">' + M.toFa(i) + '</button>';
      pg += '<button class="page-btn" data-pg="next" ' + (st.pg === pages ? 'disabled' : '') + '>‹</button>';
      $('#pagination').innerHTML = pages > 1 ? pg : '';
    }

    renderFilters(); apply();

    document.addEventListener('change', e => {
      const t = e.target;
      if (t.name === 'f-cat') { st.cat = t.value; st.pg = 1; apply(); }
      if (t.name === 'min-rating') { st.rating = +t.value; st.pg = 1; apply(); }
      if (t.id === 'avail-check') { st.avail = t.checked; st.pg = 1; apply(); }
      if (t.closest && t.closest('#brand-list')) {
        st.brands = new Set($$('#brand-list input:checked').map(i => i.value));
        st.pg = 1; apply();
      }
    });
    .forEach(([sel, k]) => {
      const el = $(sel);
      el && el.addEventListener('change', () => {
        const v = parseInt(M.enFa(el.value).replace(/[^\d]/g, ''), 10);
        st[k] = isNaN(v) || v === 0 ? null : v;
        st.pg = 1; apply();
      });
    });
    $('#sort-select').addEventListener('change', e => { st.sort = e.target.value; apply(); });
    $('#view-grid').addEventListener('click', () => { st.view = 'grid'; $('#view-grid').classList.add('active'); $('#view-list').classList.remove('active'); apply(); });
    $('#view-list').addEventListener('click', () => { st.view = 'list'; $('#view-list').classList.add('active'); $('#view-grid').classList.remove('active'); apply(); });
    $('#pagination').addEventListener('click', e => {
      const b = e.target.closest('[data-pg]');
      if (!b || b.disabled) return;
      const pages = Math.max(1, Math.ceil(filtered().length / perPage));
      st.pg = b.dataset.pg === 'prev' ? Math.max(1, st.pg - 1) : b.dataset.pg === 'next' ? Math.min(pages, st.pg + 1) : +b.dataset.pg;
      apply();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    $('#chips').addEventListener('click', e => {
      const c = e.target.closest('[data-chip]');
      if (!c) return;
      const k = c.dataset.chip;
      if (k === 'q') st.q = '';
      if (k === 'cat') st.cat = '';
      if (k.startsWith('brand|')) st.brands.delete(k.slice(6));
      if (k === 'price') { st.min = st.max = null; $('#price-min').value = ''; $('#price-max').value = ''; }
      if (k === 'avail') { st.avail = false; $('#avail-check').checked = false; }
      if (k === 'rating') { st.rating = 0; $$('input[name="min-rating"]')[0].checked = true; }
      st.pg = 1; renderFilters(); apply();
    });
    $('#reset-filters').addEventListener('click', () => {
      st.q = st.cat = ''; st.brands = new Set(); st.min = st.max = null; st.avail = false; st.rating = 0; st.pg = 1;
      $('#price-min').value = ''; $('#price-max').value = ''; $('#avail-check').checked = false;
      $$('input[name="min-rating"]')[0].checked = true;
      renderFilters(); apply();
    });
    $('#open-filters').innerHTML = icon('list', 16) + ' فیلترها';
    $('#open-filters').addEventListener('click', () => { $('#filters-panel').classList.add('open'); window.openOverlay(); });
    $('#close-filters').innerHTML = icon('x');
    $('#close-filters').addEventListener('click', window.closeOverlay);
  }

  /* ---------- PRODUCT ---------- */
  function initProduct() {
    const p = M.getProduct(qs.get('id'));
    const root = $('#pdp');
    if (!p) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon" style="margin:0 auto 18px;width:80px;height:80px;border-radius:50%;background:var(--primary-soft);display:grid;place-items:center">' + icon('search', 34) + '</div><h3>محصول یافت نشد!</h3><a class="btn btn-primary" style="margin-top:14px" href="./shop.html">بازگشت به فروشگاه</a></div>';
      return;
    }
    document.title = p.name + ' | مدینو';
    $('#pdp-breadcrumb').innerHTML = '<a href="./index.html">خانه</a><span>/</span><a href="./shop.html">فروشگاه</a><span>/</span><a href="./shop.html?cat=' + p.category + '">' + M.catName(p.category) + '</a><span>/</span><span>' + p.name + '</span>';

    let selColor = p.colors ? p.colors[0][0] : '';
    let selSize = p.sizes ? p.sizes[0] : '';
    let qty = 1;

    root.innerHTML =
    '<div class="pdp"><div class="gallery">' +
      '<div class="main-img" id="gal-main"><img src="' + M.img(p) + '" alt="' + p.name + '"></div>' +
      '<div class="thumbs">' + [1, 2, 3, 4].map(i => '<button class="thumb ' + (i === 1 ? 'active' : '') + '" data-src="' + M.img(p, i) + '"><img src="' + M.img(p, i) + '" alt="" loading="lazy"></button>').join('') + '</div>' +
    '</div><div class="pdp-info">' +
      '<h1>' + p.name + '</h1>' +
      '<div class="pdp-meta"><span class="pc-rating">' + icon('star', 15) + '<span>' + M.toFa(p.rating) + '</span><small>(' + M.toFa(p.reviewsCount) + ' نظر)</small></span><span class="brand-chiplink">' + p.brand + '</span><span>کد کالا: ' + p.id.toUpperCase() + '</span></div>' +
      '<div class="price-box"><span><span class="price-old" style="display:block">' + (p.discount ? M.price(p.price) : '') + '</span><span class="price-now">' + M.price(M.finalPrice(p)) + '</span></span>' + (p.discount ? '<span class="badge badge-off">٪' + M.toFa(p.discount) + ' تخفیف</span>' : '') + '</div>' +
      (p.colors ? '<div><div class="variant-label">رنگ: <b id="color-name">' + selColor + '</b></div><div class="swatches">' + p.colors.map((c, i) => '<button class="swatch ' + (i === 0 ? 'active' : '') + '" style="background:' + c[1] + '" data-color="' + c[0] + '" aria-label="' + c[0] + '"></button>').join('') + '</div></div>' : '') +
      (p.sizes ? '<div><div class="variant-label">سایز: <b id="size-name">' + selSize + '</b></div><div class="swatches" style="gap:8px">' + p.sizes.map((s, i) => '<button class="size-btn ' + (i === 0 ? 'active' : '') + '" data-size="' + s + '">' + s + '</button>').join('') + '</div></div>' : '') +
      '<div class="stock-note ' + (p.stock > 0 ? (p.stock <= 5 ? 'stock-low' : 'stock-ok') : 'stock-low') + '">' + (p.stock > 0 ? (p.stock <= 5 ? 'تنها ' + M.toFa(p.stock) + ' عدد در انبار باقی مانده!' : 'موجود در انبار مدینو') : 'این محصول فعلاً ناموجود است') + '</div>' +
      '<div class="pdp-actions">' +
        '<span class="stepper"><button id="pd-minus" aria-label="کاهش">' + icon('minus', 16) + '</button><input id="pd-qty" value="۱" inputmode="numeric" aria-label="تعداد"><button id="pd-plus" aria-label="افزایش">' + icon('plus', 16) + '</button></span>' +
        '<button class="btn btn-primary" id="pd-add" ' + (p.stock === 0 ? 'disabled' : '') + '>' + icon('cart', 18) + ' افزودن به سبد خرید</button>' +
        '<button class="btn btn-outline" id="pd-buy" ' + (p.stock === 0 ? 'disabled' : '') + '>خرید سریع</button>' +
        '<button class="icon-box-btn ' + (Cart.isWished(p.id) ? 'wish-active' : '') + '" data-wish="' + p.id + '" aria-label="علاقه‌مندی">' + icon('heart', 20) + '</button>' +
      '</div>' +
      '<div class="pdp-features">' +
        '<span>' + icon('truck', 16) + ' ارسال سریع به سراسر کشور</span>' +
        '<span>' + icon('shield', 16) + ' ضمانت اصالت کالا</span>' +
        '<span>' + icon('rotate', 16) + ' ۷ روز ضمانت بازگشت</span>' +
      '</div>' +
    '</div></div>';

    /* Gallery */
    $$('.thumb').forEach(t => t.addEventListener('click', () => {
      $$('.thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      $('#gal-main img').src = t.dataset.src;
    }));
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-btn lb-close">' + icon('x', 20) + '</button><img src="' + M.img(p) + '" alt=""><button class="lb-btn lb-prev">' + icon('chevR', 20) + '</button><button class="lb-btn lb-next">' + icon('chevL', 20) + '</button>';
    document.body.appendChild(lb);
    let lbi = 1;
    const setLb = i => { lbi = (i + 5) % 4 || 4; if (lbi > 4) lbi = 1; lb.querySelector('img').src = M.img(p, lbi); };
    $('#gal-main').addEventListener('click', () => { lb.classList.add('show'); document.body.classList.add('no-scroll'); });
    lb.querySelector('.lb-close').addEventListener('click', () => { lb.classList.remove('show'); document.body.classList.remove('no-scroll'); });
    lb.querySelector('.lb-next').addEventListener('click', () => setLb(lbi + 1));
    lb.querySelector('.lb-prev').addEventListener('click', () => setLb(lbi - 1));

    /* Variants & qty */
    $$('.swatch').forEach(s => s.addEventListener('click', () => { $$('.swatch').forEach(x => x.classList.remove('active')); s.classList.add('active'); selColor = s.dataset.color; $('#color-name').textContent = selColor; }));
    $$('.size-btn').forEach(s => s.addEventListener('click', () => { $$('.size-btn').forEach(x => x.classList.remove('active')); s.classList.add('active'); selSize = s.dataset.size; $('#size-name').textContent = selSize; }));
    const qtyInput = $('#pd-qty');
    const setQty = q => { qty = Math.max(1, Math.min(99, q)); qtyInput.value = M.toFa(qty); };
    $('#pd-plus').addEventListener('click', () => setQty(qty + 1));
    $('#pd-minus').addEventListener('click', () => setQty(qty - 1));
    qtyInput.addEventListener('change', () => setQty(parseInt(M.enFa(qtyInput.value).replace(/[^\d]/g, ''), 10) || 1));

    $('#pd-add').addEventListener('click', () => { Cart.add(p.id, qty, { color: selColor, size: selSize }); window.showToast('به سبد خرید اضافه شد', 'success'); });
    $('#pd-buy').addEventListener('click', () => { Cart.add(p.id, qty, { color: selColor, size: selSize }); location.href = './checkout.html'; });

    /* Tabs */
    const reviewsKey = 'madino_reviews';
    function getReviews() {
      const all = store.get(reviewsKey, {});
      if (!all[p.id]) all[p.id] = [
        { name: 'مهدی احمدی', rating: 5, text: 'کیفیت ساخت فوق‌العاده‌ای داره و دقیقاً همون چیزی بود که در توضیحات نوشته شده. ارسال هم سریع بود.', date: '۱۲ شهریور ۱۴۰۵' },
        { name: 'نگین صادقی', rating: 4, text: 'ارزش خریدش بالاست، فقط ای کاش بسته‌بندی لوازم جانبی کامل‌تر بود. در کل از خرید راضی‌ام.', date: '۲ شهریور ۱۴۰۵' }
      ];
      store.set(reviewsKey, all);
      return all[p.id];
    }
    function starsRow(r) { let s = ''; for (let i = 1; i <= 5; i++) s += '<span style="color:' + (i <= Math.round(r) ? 'var(--accent)' : 'var(--border)') + '">' + icon('star', 13) + '</span>'; return s; }
    function renderTabs() {
      const revs = getReviews();
      $('#pdp-tabs').innerHTML =
      '<div class="tab-btns">' +
        '<button class="tab-btn active" data-tb="desc">توضیحات</button>' +
        '<button class="tab-btn" data-tb="specs">مشخصات فنی</button>' +
        '<button class="tab-btn" data-tb="reviews">نظرات کاربران (' + M.toFa(revs.length) + ')</button>' +
      '</div>' +
      '<div class="tab-panel active" data-tp="desc"><p>' + p.desc + '</p><p>این محصول به‌صورت رسمی از طریق نمایندگی‌های معتبر تأمین می‌شود و شامل ضمانت اصالت و سلامت فیزیکی است. در صورت مشاهده هرگونه ایراد، تا ۷ روز فرصت دارید درخواست مرجوعی ثبت کنید.</p></div>' +
      '<div class="tab-panel" data-tp="specs"><table class="specs-table">' + M.specs(p).map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>').join('') + '</table></div>' +
      '<div class="tab-panel" data-tp="reviews">' +
        revs.map(r => '<div class="review-item"><div class="review-head"><span class="review-avatar">' + r.name.charAt(0) + '</span><h4>' + r.name + '</h4><time>' + r.date + '</time></div><div style="margin-bottom:4px">' + starsRow(r.rating) + '</div><p>' + r.text + '</p></div>').join('') +
        '<form class="review-form" id="review-form">' +
          '<h3>دیدگاه خود را بنویسید</h3>' +
          '<div class="form-group"><label>امتیاز شما</label><div class="star-picker" id="star-picker">' + [1, 2, 3, 4, 5].map(i => '<button type="button" data-v="' + i + '">' + icon('star', 20) + '</button>').join('') + '</div></div>' +
          '<div class="form-group"><label>نام شما</label><input type="text" id="rv-name" class="input" placeholder="مثلاً علی رضایی"><span class="error-msg"></span></div>' +
          '<div class="form-group"><label>متن دیدگاه</label><textarea id="rv-text" class="input" placeholder="تجربه خود از این محصول را بنویسید..."></textarea><span class="error-msg"></span></div>' +
          '<button type="submit" class="btn btn-primary">ثبت دیدگاه</button>' +
        '</form>' +
      '</div>';
      $$('.tab-btn').forEach(b => b.addEventListener('click', () => {
        $$('.tab-btn').forEach(x => x.classList.remove('active'));
        $$('.tab-panel').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        $('[data-tp="' + b.dataset.tb + '"]').classList.add('active');
      }));
      let stars = 5;
      $$('#star-picker button').forEach(b => {
        b.addEventListener('click', () => {
          stars = +b.dataset.v;
          $$('#star-picker button').forEach(x => x.classList.toggle('on', +x.dataset.v <= stars));
        });
        b.classList.toggle('on', +b.dataset.v <= stars);
      });
      $('#review-form').addEventListener('submit', e => {
        e.preventDefault();
        const name = $('#rv-name').value.trim(), text = $('#rv-text').value.trim();
        let ok = true;
        if (name.length < 2) { $('#rv-name').classList.add('invalid'); ok = false; } else $('#rv-name').classList.remove('invalid');
        if (text.length < 10) { $('#rv-text').classList.add('invalid'); ok = false; } else $('#rv-text').classList.remove('invalid');
        if (!ok) return;
        const all = store.get(reviewsKey, {});
        all[p.id] = [{ name: name, rating: stars, text: text, date: 'امروز' }].concat(all[p.id]);
        store.set(reviewsKey, all);
        window.showToast('دیدگاه شما ثبت شد؛ سپاس از همراهی‌تان', 'success');
        renderTabs();
      });
    }
    renderTabs();

    /* Related */
    const rel = M.products.filter(x => x.category === p.category && x.id !== p.id);
    if (rel.length < 4) rel.push.apply(rel, M.products.filter(x => x.category !== p.category && x.id !== p.id));
    renderGrid($('#related-grid'), rel.slice(0, 4));
  }

  /* ---------- CART PAGE ---------- */
  function initCartPage() {
    const root = $('#cart-root');
    function render() {
      const items = Cart.items();
      if (!items.length) {
        root.innerHTML = '<div class="empty-state"><div class="empty-icon">' + icon('cart', 38) + '</div><h3>سبد خرید شما خالی است</h3><p>هنوز محصولی انتخاب نکرده‌اید.</p><div class="empty-actions"><a class="btn btn-primary" href="./shop.html">مشاهده محصولات</a></div></div>';
        return;
      }
      const cov = Cart.couponCode();
      root.innerHTML =
      '<div class="cart-layout"><div class="cart-list">' +
        items.map(i => {
          const p = M.getProduct(i.id);
          if (!p) return '';
          const opts = [i.color, i.size].filter(Boolean).join(' / ');
          return '<div class="cart-item"><a href="./product.html?id=' + p.id + '"><img src="' + M.img(p) + '" alt=""></a>' +
          '<div><a class="ci-name" href="./product.html?id=' + p.id + '">' + p.name + '</a>' + (opts ? '<div class="ci-variant">' + opts + '</div>' : '') + '<div class="ci-price">' + M.price(M.finalPrice(p)) + '</div></div>' +
          '<div class="ci-side"><span class="stepper sm"><button data-dec="' + i.k + '" aria-label="کاهش">' + icon('minus', 14) + '</button><input value="' + M.toFa(i.qty) + '" data-qty="' + i.k + '" inputmode="numeric" aria-label="تعداد"><button data-inc="' + i.k + '" aria-label="افزایش">' + icon('plus', 14) + '</button></span>' +
          '<button class="ci-remove" data-rm="' + i.k + '">' + icon('trash', 14) + ' حذف</button></div></div>';
        }).join('') +
      '</div>' +
      '<aside class="summary-card"><h3>خلاصه سفارش</h3>' +
        '<div class="sum-row"><span>قیمت کالاها (' + M.toFa(Cart.count()) + ')</span><b>' + M.price(Cart.listSum()) + '</b></div>' +
        (Cart.productSavings() ? '<div class="sum-row off"><span>سود شما از خرید</span><b>' + M.price(Cart.productSavings()) + '-</b></div>' : '') +
        (Cart.couponValue() ? '<div class="sum-row off"><span>تخفیف کد ' + cov + '</span><b>' + M.price(Cart.couponValue()) + '-</b></div>' : '') +
        '<div class="sum-row ' + (Cart.shipping() === 0 ? 'free' : '') + '"><span>هزینه ارسال</span><b>' + (Cart.shipping() === 0 ? 'رایگان' : M.price(Cart.shipping())) + '</b></div>' +
        (Cart.shipping() > 0 ? '<div class="ship-note">' + M.price(M.freeShippingThreshold - Cart.afterDiscount()) + ' تا ارسال رایگان باقی مانده!</div>' : '') +
        '<div class="sum-total"><span>مبلغ قابل پرداخت</span><span>' + M.price(Cart.total()) + '</span></div>' +
        (Cart.couponValue()
          ? '<div class="coupon-applied"><span>کد ' + cov + ' فعال است</span><button id="rm-coupon">حذف</button></div>'
          : '<div class="coupon-row"><input type="text" id="coupon-input" class="input" placeholder="کد تخفیف (مثلاً MADINO10)"><button class="btn btn-outline" id="apply-coupon">اعمال</button></div>') +
        '<a class="btn btn-primary btn-block" href="./checkout.html">ادامه فرآیند خرید</a>' +
        '<a class="continue-link" href="./shop.html">← ادامه خرید</a>' +
      '</aside></div>';
      root.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => { const it = Cart.items().find(x => x.k === b.dataset.inc); Cart.setQty(b.dataset.inc, it.qty + 1); }));
      root.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => { const it = Cart.items().find(x => x.k === b.dataset.dec); Cart.setQty(b.dataset.dec, it.qty - 1); }));
      root.querySelectorAll('[data-qty]').forEach(inp => inp.addEventListener('change', () => Cart.setQty(inp.dataset.qty, parseInt(M.enFa(inp.value).replace(/[^\d]/g, ''), 10) || 1)));
      root.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.rm); window.showToast('محصول از سبد حذف شد', ''); }));
      const ac = $('#apply-coupon');
      ac && ac.addEventListener('click', () => {
        const r = Cart.applyCoupon($('#coupon-input').value);
        window.showToast(r.msg, r.ok ? 'success' : 'error');
        if (r.ok) render();
      });
      const rc = $('#rm-coupon');
      rc && rc.addEventListener('click', () => { Cart.removeCoupon(); render(); });
    }
    render();
    document.addEventListener('cart:change', render);
  }

  /* ---------- CHECKOUT ---------- */
  function initCheckout() {
    const root = $('#checkout-root'), stepsEl = $('#co-steps');
    let step = 1, pay = 'gateway', ordered = false;
    const stepNames = ['اطلاعات ارسال', 'روش پرداخت', 'بازبینی و پرداخت'];
    function renderSteps() {
      stepsEl.innerHTML = stepNames.map((n, i) => {
        const num = i + 1;
        return (i ? '<span class="step-line"></span>' : '') + '<span class="step ' + (num < step ? 'done' : num === step ? 'active' : '') + '"><span class="step-num">' + (num < step ? '✓' : M.toFa(num)) + '</span><span class="step-label">' + n + '</span></span>';
      }).join('');
    }
    function summary() {
      return '<aside class="summary-card"><h3>سفارش شما</h3>' +
        Cart.items().map(i => { const p = M.getProduct(i.id); return p ? '<div class="mini-item"><img src="' + M.img(p) + '" alt=""><span class="mi-name">' + p.name + '</span><b>×' + M.toFa(i.qty) + '</b></div>' : ''; }).join('') +
        '<div class="sum-row"><span>جمع کالاها</span><b>' + M.price(Cart.subtotal()) + '</b></div>' +
        (Cart.couponValue() ? '<div class="sum-row off"><span>تخفیف کد</span><b>' + M.price(Cart.couponValue()) + '-</b></div>' : '') +
        '<div class="sum-row"><span>ارسال</span><b>' + (Cart.shipping() === 0 ? 'رایگان' : M.price(Cart.shipping())) + '</b></div>' +
        '<div class="sum-total"><span>قابل پرداخت</span><span>' + M.price(Cart.total()) + '</span></div></aside>';
    }
    const provinces = ['تهران','اصفهان','خراسان رضوی','فارس','آذربایجان شرقی','البرز','گیلان','مازندران','خوزستان','یزد'];
    function render() {
      renderSteps();
      if (!Cart.count() && !ordered) {
        root.innerHTML = '<div class="empty-state"><div class="empty-icon">' + icon('cart', 38) + '</div><h3>سبد خرید خالی است</h3><p>برای تسویه حساب، ابتدا محصولی به سبد اضافه کنید.</p><div class="empty-actions"><a class="btn btn-primary" href="./shop.html">مشاهده محصولات</a></div></div>';
        return;
      }
      if (ordered) return;
      const addr = store.get('madino_addr', {});
      if (step === 1) {
        root.innerHTML = '<div class="co-grid"><form class="co-panel" id="addr-form">' +
          '<h2>اطلاعات گیرنده و آدرس</h2>' +
          '<div class="form-grid">' +
            '<div class="form-group"><label>نام و نام‌خانوادگی</label><input class="input" id="co-name" value="' + (addr.name || '') + '" placeholder="مثلاً سارا محمدی"><span class="error-msg"></span></div>' +
            '<div class="form-group"><label>شماره موبایل</label><input class="input" id="co-phone" dir="ltr" value="' + (addr.phone || '') + '" placeholder="09123456789"><span class="error-msg"></span></div>' +
          '</div>' +
          '<div class="form-grid">' +
            '<div class="form-group"><label>استان</label><select id="co-province" class="input">' + provinces.map(pr => '<option ' + (addr.province === pr ? 'selected' : '') + '>' + pr + '</option>').join('') + '</select></div>' +
            '<div class="form-group"><label>شهر</label><input class="input" id="co-city" value="' + (addr.city || '') + '" placeholder="مثلاً تهران"><span class="error-msg"></span></div>' +
          '</div>' +
          '<div class="form-group"><label>نشانی کامل پستی</label><textarea class="input" id="co-address" rows="3" placeholder="خیابان، کوچه، پلاک و واحد...">' + (addr.address || '') + '</textarea><span class="error-msg"></span></div>' +
          '<div class="form-group"><label>کد پستی (اختیاری)</label><input class="input" id="co-postal" dir="ltr" value="' + (addr.postal || '') + '" placeholder="1234567890"></div>' +
          '<div class="co-nav"><span></span><button type="submit" class="btn btn-primary">ادامه → روش پرداخت</button></div>' +
        '</form>' + summary() + '</div>';
        $('#addr-form').addEventListener('submit', e => {
          e.preventDefault();
          const v = id => $(id).value.trim();
          let ok = true;
          const err = (id, m) => { const el = $(id); el.classList.add('invalid'); el.parentElement.querySelector('.error-msg').textContent = m; ok = false; };
          if (v('#co-name').length < 3) err('#co-name', 'نام را کامل وارد کنید');
          const ph = M.enFa(v('#co-phone')).replace(/[^\d]/g, '');
          if (!/^09\d{9}$/.test(ph)) err('#co-phone', 'شماره موبایل معتبر نیست');
          if (v('#co-city').length < 2) err('#co-city', 'شهر را وارد کنید');
          if (v('#co-address').length < 10) err('#co-address', 'نشانی کامل را وارد کنید');
          if (!ok) return;
          store.set('madino_addr', { name: v('#co-name'), phone: ph, province: v('#co-province'), city: v('#co-city'), address: v('#co-address'), postal: v('#co-postal') });
          step = 2; render();
        });
      } else if (step === 2) {
        const opts = ;
        root.innerHTML = '<div class="co-grid"><div class="co-panel"><h2>روش پرداخت را انتخاب کنید</h2>' +
          opts.map((o, i) => '<label class="pay-opt ' + (pay === o[0] ? 'active' : '') + '"><input type="radio" name="pay" value="' + o[0] + '" ' + (pay === o[0] ? 'checked' : '') + '><span class="pay-icon">' + o[1] + '</span><span><h4>' + o[2] + '</h4><p>' + o[3] + '</p></span></label>').join('') +
          '<div class="co-nav"><button class="btn btn-outline" id="back-1">→ بازگشت</button><button class="btn btn-primary" id="to-3">بازبینی نهایی ←</button></div>' +
        '</div>' + summary() + '</div>';
        $$('input[name="pay"]').forEach(r => r.addEventListener('change', () => { pay = r.value; $$('.pay-opt').forEach(o => o.classList.toggle('active', o.querySelector('input').checked)); }));
        $('#back-1').addEventListener('click', () => { step = 1; render(); });
        $('#to-3').addEventListener('click', () => { step = 3; render(); });
      } else {
        const a = store.get('madino_addr', {});
        const payName = { gateway: 'پرداخت اینترنتی', wallet: 'کیف پول مدینو', cod: 'پرداخت در محل' }[pay];
        root.innerHTML = '<div class="co-grid"><div>' +
          '<div class="review-block"><h4>آدرس تحویل<button data-goto="1">ویرایش</button></h4><p>' + a.name + ' — ' + M.enFa(a.phone).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) + '<br>' + a.province + '، ' + a.city + '، ' + a.address + (a.postal ? ' — کدپستی: ' + a.postal : '') + '</p></div>' +
          '<div class="review-block"><h4>روش پرداخت<button data-goto="2">ویرایش</button></h4><p>' + payName + '</p></div>' +
          '<div class="review-block"><h4>اقلام سفارش (' + M.toFa(Cart.count()) + ' کالا)</h4>' + Cart.items().map(i => { const p = M.getProduct(i.id); return p ? '<div class="mini-item"><img src="' + M.img(p) + '" alt=""><span class="mi-name">' + p.name + '</span><b>×' + M.toFa(i.qty) + '</b></div>' : ''; }).join('') + '</div>' +
          '<button class="btn btn-primary btn-block" id="final-pay" style="height:52px;font-size:15px">پرداخت و ثبت نهایی سفارش — ' + M.price(Cart.total()) + '</button>' +
        '</div>' + summary() + '</div>';
        $$('[data-goto]').forEach(b => b.addEventListener('click', () => { step = +b.dataset.goto; render(); }));
        $('#final-pay').addEventListener('click', () => {
          const btn = $('#final-pay');
          btn.disabled = true; btn.textContent = 'در حال اتصال به درگاه پرداخت...';
          setTimeout(() => {
            const code = 'MD-' + Math.floor(100000 + Math.random() * 900000);
            ordered = true;
            Cart.clear();
            renderSteps();
            root.innerHTML = '<div class="order-success"><div class="success-icon">' + icon('check', 42) + '</div><h2>سفارش شما با موفقیت ثبت شد! 🎉</h2><span class="order-code" dir="ltr">' + code + '</span><p>جزئیات سفارش برای شما پیامک خواهد شد.<br>از اعتماد شما به مدینو سپاسگزاریم.</p><div class="empty-actions"><a class="btn btn-primary" href="./index.html">بازگشت به خانه</a><a class="btn btn-outline" href="./shop.html">ادامه خرید</a></div></div>';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1600);
        });
      }
    }
    render();
    document.addEventListener('cart:change', () => { if (!ordered) render(); });
  }

  /* ---------- WISHLIST ---------- */
  function initWishlist() {
    const root = $('#wish-root');
    function render() {
      const list = Cart.wishList();
      if (!list.length) {
        root.innerHTML = '<div class="empty-state"><div class="empty-icon">' + icon('heart', 38) + '</div><h3>لیست علاقه‌مندی‌ها خالی است</h3><p>با زدن آیکون قلب روی محصولات، آن‌ها را اینجا ذخیره کنید.</p><div class="empty-actions"><a class="btn btn-primary" href="./shop.html">مشاهده محصولات</a></div></div>';
        return;
      }
      root.innerHTML = '<div class="products-grid" id="wish-grid"></div>';
      renderGrid($('#wish-grid'), list);
    }
    render();
    document.addEventListener('wish:change', render);
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    const root = $('#faq-list');
    function render(q) {
      q = (q || '').trim();
      root.innerHTML = M.faqs.map(g => {
        const items = g.items.filter(x => !q || x.q.includes(q) || x.a.includes(q));
        if (!items.length) return '';
        return '<h3 class="faq-group-title">' + g.group + '</h3>' + items.map(x =>
          '<div class="faq-item"><button class="faq-q" type="button">' + x.q + icon('chevD', 18) + '</button><div class="faq-a"><p>' + x.a + '</p></div></div>'
        ).join('');
      }).join('') || '<div class="empty-state"><h3>نتیجه‌ای یافت نشد</h3><p>عبارت دیگری را امتحان کنید یا از <a href="./contact.html" style="color:var(--primary)">صفحه تماس</a> بپرسید.</p></div>';
    }
    render();
    root.addEventListener('click', e => {
      const q = e.target.closest('.faq-q');
      if (!q) return;
      const item = q.parentElement;
      const open = item.classList.contains('open');
      $$('.faq-item').forEach(x => x.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
    $('#faq-search').addEventListener('input', e => render(e.target.value));
  }

  /* ---------- BLOG ---------- */
  function postCard(p) {
    return '<article class="post-card"><a class="post-img" href="./blog-post.html?id=' + p.id + '"><img src="https://picsum.photos/seed/' + p.seed + '/700/400" alt="' + p.title + '" loading="lazy"></a>' +
      '<div class="post-body"><span class="post-tag">' + p.tag + '</span><div class="post-meta"><span>' + p.date + '</span><span>' + p.mins + ' مطالعه</span></div>' +
      '<a class="post-title" href="./blog-post.html?id=' + p.id + '">' + p.title + '</a><p class="post-excerpt">' + p.excerpt + '</p></div></article>';
  }
  function initBlog() {
    const root = $('#blog-root'), bc = $('#blog-breadcrumb');
    const id = qs.get('id');
    const post = M.blogPosts.find(b => b.id === id);
    if (post) {
      document.title = post.title + ' | وبلاگ مدینو';
      bc.innerHTML = '<a href="./index.html">خانه</a><span>/</span><a href="./blog.html">وبلاگ</a><span>/</span><span>' + post.title + '</span>';
      root.innerHTML = '<article class="post-single"><span class="post-tag">' + post.tag + '</span><h1 style="margin:12px 0 6px">' + post.title + '</h1>' +
        '<div class="post-meta" style="margin-bottom:6px"><span>' + post.date + '</span><span>' + post.mins + ' مطالعه</span></div>' +
        '<div class="post-hero"><img src="https://picsum.photos/seed/' + post.seed + '/900/450" alt="' + post.title + '"></div>' +
        '<div class="post-content">' + post.content.map(c => '<p>' + c + '</p>').join('') + '</div></article>' +
        '<section class="related-posts"><div class="section-head"><h2>مطالب مرتبط</h2></div><div class="blog-grid">' +
        M.blogPosts.filter(b => b.id !== post.id).slice(0, 3).map(postCard).join('') + '</div></section>';
    } else {
      root.innerHTML = '<article class="post-featured">' + M.blogPosts.slice(0, 1).map(p =>
        '<a class="post-img" href="./blog-post.html?id=' + p.id + '"><img src="https://picsum.photos/seed/' + p.seed + '/900/500" alt="' + p.title + '"></a>' +
        '<div class="post-body"><span class="post-tag">' + p.tag + '</span><div class="post-meta"><span>' + p.date + '</span><span>' + p.mins + ' مطالعه</span></div><a class="post-title" href="./blog-post.html?id=' + p.id + '">' + p.title + '</a><p class="post-excerpt">' + p.excerpt + '</p><a class="btn btn-outline btn-sm" style="align-self:flex-start" href="./blog-post.html?id=' + p.id + '">مطالعه مقاله</a></div>'
      ).join('') + '</article><div class="blog-grid">' + M.blogPosts.slice(1).map(postCard).join('') + '</div>';
    }
  }

  /* ---------- AUTH ---------- */
  function initAuth() {
    const mode0 = document.body.dataset.mode === 'register' ? 'register' : 'login';
    function show(mode) {
      $$('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
      $('#login-form').hidden = mode !== 'login';
      $('#register-form').hidden = mode !== 'register';
    }
    function renderLogged() {
      const u = store.get('madino_user', null);
      $('#auth-logged').hidden = !u;
      $('#login-form').hidden = !!u || mode0 !== 'login';
      $('#register-form').hidden = !!u || mode0 !== 'register';
      $$('.auth-tabs').forEach(t => t.style.display = u ? 'none' : '');
      if (u) $('#auth-logged p').textContent = '✅ خوش آمدید، ' + u.name + '!';
    }
    $$('.auth-tab').forEach(t => t.addEventListener('click', () => show(t.dataset.mode)));
    renderLogged();

    $('#register-form').addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#rg-name').value.trim();
      const phone = M.enFa($('#rg-phone').value).replace(/[^\d]/g, '');
      const p1 = $('#rg-pass').value, p2 = $('#rg-pass2').value;
      let ok = true;
      const err = (id, m) => { const el = $(id); el.classList.add('invalid'); const em = el.closest('.form-group').querySelector('.error-msg'); if (em) em.textContent = m; ok = false; };
      const clr = id => { $(id).classList.remove('invalid'); const em = $(id).closest('.form-group').querySelector('.error-msg'); if (em) em.textContent = ''; };
      ['rg-name','rg-phone','rg-pass','rg-pass2'].forEach(clr);
      if (name.length < 3) err('rg-name', 'نام را کامل وارد کنید');
      if (!/^09\d{9}$/.test(phone)) err('rg-phone', 'شماره موبایل معتبر نیست (مثال: 09123456789)');
      if (p1.length < 6) err('rg-pass', 'رمز عبور حداقل ۶ کاراکتر باشد');
      if (p1 !== p2) err('rg-pass2', 'تکرار رمز عبور مطابقت ندارد');
      if (!$('#rg-terms').checked) { window.showToast('پذیرش قوانین الزامی است', 'error'); ok = false; }
      if (!ok) return;
      const users = store.get('madino_users', []);
      if (users.some(u => u.phone === phone)) { window.showToast('این شماره قبلاً ثبت شده است', 'error'); return; }
      users.push({ name: name, phone: phone, pass: p1 });
      store.set('madino_users', users);
      store.set('madino_user', { name: name, phone: phone });
      window.showToast('حساب کاربری شما ساخته شد 🎉', 'success');
      renderLogged();
    });

    $('#login-form').addEventListener('submit', e => {
      e.preventDefault();
      const user = M.enFa($('#li-user').value).replace(/[^\d@._a-zA-Z]/g, '');
      const pass = $('#li-pass').value;
      const users = store.get('madino_users', []);
      const found = users.find(u => (u.phone === user.replace(/[^\d]/g, '') || u.phone === user) && u.pass === pass);
      if (!found) { window.showToast(users.length ? 'شماره یا رمز عبور اشتباه است' : 'ابتدا ثبت‌نام کنید (نسخه نمایشی)', 'error'); return; }
      store.set('madino_user', { name: found.name, phone: found.phone });
      window.showToast('خوش آمدید، ' + found.name + '!', 'success');
      renderLogged();
    });

    $('#logout-btn').addEventListener('click', () => { localStorage.removeItem('madino_user'); window.showToast('از حساب خود خارج شدید', ''); renderLogged(); });
  }

  /* ---------- CONTACT ---------- */
  function initContact() {
    $('#contact-form').addEventListener('submit', e => {
      e.preventDefault();
      const f = id => $(id);
      let ok = true;
      const rules = ;
      rules.forEach(r => {
        const el = f(r[0]);
        if (!r[1](el.value)) { el.classList.add('invalid'); el.closest('.form-group').querySelector('.error-msg').textContent = r[2]; ok = false; }
        else { el.classList.remove('invalid'); el.closest('.form-group').querySelector('.error-msg').textContent = ''; }
      });
      if (!ok) return;
      window.showToast('پیام شما ارسال شد؛ به‌زودی پاسخ می‌دهیم', 'success');
      e.target.reset();
    });
  }

  /* ---------- ABOUT ---------- */
  function initAbout() {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, target = +el.dataset.target, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
      (function tick(t) {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = M.fmt(target * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    }), { threshold: .4 });
    $$('.stat-num').forEach(el => io.observe(el));
  }

  /* ---------- Dispatch ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (page === 'home') initHome();
    else if (page === 'shop') initShop();
    else if (page === 'product') initProduct();
    else if (page === 'cart') initCartPage();
    else if (page === 'checkout') initCheckout();
    else if (page === 'wishlist') initWishlist();
    else if (page === 'faq') initFaq();
    else if (page === 'blog') initBlog();
    else if (page === 'auth') initAuth();
    else if (page === 'contact') initContact();
    else if (page === 'about') initAbout();
  });
})();