/* Madino Store — Header, footer, theme, search, drawer, UI helpers */
(function () {
  const M = window.MADINO_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  window.$ = $; window.$$ = $$;

  const svg = (paths, s) => '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  const I = {
    bag:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    cart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    heart:'<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    menu:'<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
    chevL:'<path d="m15 18-6-6 6-6"/>',
    chevR:'<path d="m9 18 6-6-6-6"/>',
    chevD:'<path d="m6 9 6 6 6-6"/>',
    star:'<path fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    truck:'<path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    shield:'<path d="M20 13c0 5-3.5 7.5-7.7 9a.6.6 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/>',
    rotate:'<path d="M3 12a9 9 0 0 1 15.5-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.4L3 16"/><path d="M3 21v-5h5"/>',
    headset:'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><path d="M21 15a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h3Z"/><path d="M3 15a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H3Z"/><path d="M21 17v1a3 3 0 0 1-3 3h-5"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 2 .5 3 .7a2 2 0 0 1 1.5 2Z"/>',
    chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    list:'<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    up:'<path d="m18 15-6-6-6 6"/>',
    plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus:'<path d="M5 12h14"/>',
    trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    zoom:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
    insta:'<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2Z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    telegram:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    twitter:'<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>'
  };
  window.icon = (name, s) => svg(I[name] || I.bag, s || 20);

  /* Theme */
  function applyTheme(t) {
    document.body.classList.toggle('dark', t === 'dark');
    const b = $('#theme-btn');
    if (b) b.innerHTML = window.icon(t === 'dark' ? 'sun' : 'moon', 20);
  }
  document.addEventListener('click', e => {
    if (e.target.closest('#theme-btn')) {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem('madino-theme', next);
      applyTheme(next);
    }
  });
  applyTheme(localStorage.getItem('madino-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  /* Header */
  function renderHeader() {
    const page = document.body.dataset.page || '';
    const map = { product:'shop', checkout:'cart' };
    const active = map[page] || page;
    const nav = ;
    $('#site-header').innerHTML =
    '<div class="topbar"><div class="container topbar-in">' +
      '<div class="topbar-item">' + window.icon('truck',16) + '<span class="t-long">ارسال رایگان برای خرید بالای ۵ میلیون تومان</span></div>' +
      '<div class="topbar-left">' +
        '<a class="topbar-item hide-sm" href="./contact.html">' + window.icon('phone',15) + '<span class="t-long">۰۲۱-۹۱۰۰۰۰۰۰</span></a>' +
        '<a class="topbar-item" href="./faq.html">' + window.icon('chat',15) + '<span>پیگیری سفارش</span></a>' +
      '</div>' +
    '</div></div>' +
    '<div class="header" id="main-header"><div class="container header-in">' +
      '<button class="icon-btn menu-btn" id="menu-btn" aria-label="باز کردن منو">' + window.icon('menu') + '</button>' +
      '<a class="logo" href="./index.html"><span class="logo-mark">' + window.icon('bag',22) + '</span><span class="logo-text">مدینو</span></a>' +
      '<div class="search"><input type="text" id="search-input" placeholder="جستجو در محصولات مدینو..." autocomplete="off" aria-label="جستجوی محصولات"><button class="search-btn" aria-label="جستجو">' + window.icon('search',18) + '</button><div class="suggest" id="suggest"></div></div>' +
      '<nav class="nav" aria-label="منوی اصلی">' + nav.map(n => '<a href="./' + n[0] + '" class="' + (active === n[1] ? 'active' : '') + '">' + n[2] + '</a>').join('') + '</nav>' +
      '<div class="actions">' +
        '<button class="icon-btn" id="theme-btn" aria-label="تغییر تم روشن و تاریک"></button>' +
        '<a class="icon-btn" href="./wishlist.html" aria-label="علاقه‌مندی‌ها">' + window.icon('heart') + '<span class="badge-count" id="wish-count" hidden>۰</span></a>' +
        '<a class="icon-btn hide-sm" href="./login.html" aria-label="حساب کاربری">' + window.icon('user') + '</a>' +
        '<button class="icon-btn" id="cart-btn" aria-label="سبد خرید">' + window.icon('cart') + '<span class="badge-count" id="cart-count" hidden>۰</span></button>' +
      '</div>' +
    '</div></div>' +
    '<aside class="mobile-drawer" id="mobile-drawer" aria-label="منوی موبایل">' +
      '<div class="drawer-head"><a class="logo" href="./index.html"><span class="logo-mark">' + window.icon('bag',20) + '</span><span class="logo-text">مدینو</span></a><button class="icon-btn" id="drawer-close" aria-label="بستن منو">' + window.icon('x') + '</button></div>' +
      '<div class="drawer-nav">' + nav.map(n => '<a href="./' + n[0] + '">' + window.icon('chevL',18) + '<span>' + n[2] + '</span></a>').join('') + '</div>' +
      '<div class="drawer-cats"><h4>دسته‌بندی‌ها</h4><div class="drawer-nav">' + M.categories.map(c => '<a href="./shop.html?cat=' + c.id + '">' + window.icon('chevL',18) + '<span>' + c.name + '</span></a>').join('') + '</div></div>' +
    '</aside>' +
    '<nav class="bottom-nav" aria-label="ناوبری موبایل">' +
      '<a href="./index.html" class="' + (active==='home'?'active':'') + '">' + window.icon('home',22) + '<span>خانه</span></a>' +
      '<a href="./shop.html" class="' + (active==='shop'?'active':'') + '">' + window.icon('grid',22) + '<span>فروشگاه</span></a>' +
      '<a href="./wishlist.html" class="' + (active==='wishlist'?'active':'') + '">' + window.icon('heart',22) + '<span>علاقه‌مندی</span></a>' +
      '<a href="./cart.html" class="' + (active==='cart'?'active':'') + '">' + window.icon('cart',22) + '<span>سبد خرید</span></a>' +
      '<a href="./login.html" class="' + (active==='auth'?'active':'') + '">' + window.icon('user',22) + '<span>حساب</span></a>' +
    '</nav>' +
    '<button class="to-top" id="to-top" aria-label="بازگشت به بالا">' + window.icon('up',20) + '</button>' +
    '<div class="overlay" id="overlay"></div>' +
    '<div class="toast-box" id="toast-box"></div>';
    applyTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
  }

  /* Footer */
  function renderFooter() {
    $('#site-footer').innerHTML =
    '<footer class="footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div><a class="logo" href="./index.html"><span class="logo-mark">' + window.icon('bag',22) + '</span><span class="logo-text">مدینو</span></a>' +
        '<p class="f-about">مدینو، تجربه‌ای مدرن از خرید آنلاین؛ کالاهای اورجینال با قیمت منصفانه، ارسال سریع به سراسر کشور و پشتیبانی انسانی ۷ روز هفته.</p>' +
        '<div class="f-social">' +
          '<a href="#" aria-label="اینستاگرام">' + window.icon('insta',18) + '</a>' +
          '<a href="#" aria-label="تلگرام">' + window.icon('telegram',18) + '</a>' +
          '<a href="#" aria-label="توییتر">' + window.icon('twitter',18) + '</a>' +
        '</div></div>' +
        '<div class="f-links"><h4>دسترسی سریع</h4>' +
          '<a href="./shop.html">فروشگاه</a><a href="./blog.html">وبلاگ</a><a href="./about.html">درباره ما</a><a href="./contact.html">تماس با ما</a><a href="./faq.html">سوالات متداول</a>' +
        '</div>' +
        '<div class="f-links"><h4>دسته‌بندی‌ها</h4>' +
          M.categories.slice(0,5).map(c => '<a href="./shop.html?cat=' + c.id + '">' + c.name + '</a>').join('') +
        '</div>' +
        '<div class="f-contact"><h4>اطلاعات تماس</h4>' +
          '<p>' + window.icon('pin',16) + '<span>تهران، خیابان ولیعصر، برج مدرن مدینو، طبقه ۷</span></p>' +
          '<p>' + window.icon('phone',16) + '<span dir="ltr">۰۲۱ - ۹۱۰۰۰۰۰۰</span></p>' +
          '<p>' + window.icon('mail',16) + '<span dir="ltr">support@madino.example</span></p>' +
        '</div>' +
      '</div>' +
      '<div class="f-bottom"><span>© ۱۴۰۵ فروشگاه مدینو — تمامی حقوق محفوظ است. (نمونه‌کار آموزشی)</span>' +
      '<div class="pay-badges"><span>پرداخت امن</span><span>SSL</span><span>۷ روز ضمانت بازگشت</span></div></div>' +
    '</div></footer>';
  }

  /* Toast */
  window.showToast = function (msg, type) {
    const box = $('#toast-box');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.innerHTML = window.icon(type === 'error' ? 'x' : 'check', 18) + '<span>' + msg + '</span>';
    box.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '.3s'; }, 2600);
    setTimeout(() => t.remove(), 3000);
  };

  /* Drawer / overlay */
  window.openOverlay = function () { $('#overlay') && $('#overlay').classList.add('show'); document.body.classList.add('no-scroll'); };
  window.closeOverlay = function () {
    $('#overlay') && $('#overlay').classList.remove('show');
    document.body.classList.remove('no-scroll');
    const d = $('#mobile-drawer'); d && d.classList.remove('open');
    const f = $('#filters-panel'); f && f.classList.remove('open');
    const m = $('#mini-cart'); m && m.classList.remove('open');
  };

  function initUI() {
    const ob = $('#menu-btn'), dc = $('#drawer-close'), ov = $('#overlay');
    ob && ob.addEventListener('click', () => { $('#mobile-drawer').classList.add('open'); window.openOverlay(); });
    dc && dc.addEventListener('click', window.closeOverlay);
    ov && ov.addEventListener('click', window.closeOverlay);

    const tt = $('#to-top');
    const header = $('#main-header');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      tt && tt.classList.toggle('show', y > 500);
      header && header.classList.toggle('scrolled', y > 10);
    }, { passive:true });
    tt && tt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

    /* Live search */
    const inp = $('#search-input'), sug = $('#suggest');
    if (inp && sug) {
      inp.addEventListener('input', () => {
        const q = inp.value.trim();
        if (q.length < 2) { sug.classList.remove('open'); return; }
        const res = M.products.filter(p => p.name.includes(q)).slice(0, 6);
        sug.innerHTML = res.length
          ? res.map(p => '<a class="suggest-item" href="./product.html?id=' + p.id + '"><img src="' + M.img(p) + '" alt=""><span><span class="si-name">' + p.name + '</span><span class="si-price">' + M.price(M.finalPrice(p)) + '</span></span></a>').join('') +
            '<a class="suggest-all" href="./shop.html?q=' + encodeURIComponent(q) + '">مشاهده همه نتایج</a>'
          : '<div class="suggest-item"><span class="si-name">نتیجه‌ای یافت نشد</span></div>';
        sug.classList.add('open');
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const q = inp.value.trim();
          if (q) location.href = './shop.html?q=' + encodeURIComponent(q);
        }
        if (e.key === 'Escape') sug.classList.remove('open');
      });
      document.addEventListener('click', e => { if (!e.target.closest('.search')) sug.classList.remove('open'); });
    }

    /* Reveal on scroll */
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } }), { threshold: .12 });
    $$('.reveal').forEach(el => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => { renderHeader(); renderFooter(); initUI(); });
})();