/* Madino Store — Demo data (all sample content is original) */
window.MADINO_DATA = {
  categories: [
    { id:'mobiles', name:'موبایل', icon:'smartphone', img:'https://picsum.photos/seed/md-cat-mobiles/500/380' },
    { id:'laptops', name:'لپ‌تاپ', icon:'laptop', img:'https://picsum.photos/seed/md-cat-laptops/500/380' },
    { id:'accessories', name:'لوازم جانبی', icon:'headphones', img:'https://picsum.photos/seed/md-cat-acc/500/380' },
    { id:'fashion', name:'پوشاک', icon:'shirt', img:'https://picsum.photos/seed/md-cat-fashion/500/380' },
    { id:'home', name:'خانه و آشپزخانه', icon:'lamp', img:'https://picsum.photos/seed/md-cat-home/500/380' },
    { id:'beauty', name:'زیبایی و سلامت', icon:'sparkles', img:'https://picsum.photos/seed/md-cat-beauty/500/380' }
  ],
  brands: ['سامسونگ','اپل','شیائومی','ایسوس','لنوو','سونی','لاجیتک','انکر','نایک','آدیداس','فیلیپس','لافارر','بابلیس','ام‌اس‌آی'],
  coupons: {
    'MADINO10': { type:'percent', value:10, label:'۱۰٪ تخفیف کل سبد' },
    'WELCOME':  { type:'fixed', value:500000, label:'۵۰۰٬۰۰۰ تومان تخفیف' }
  },
  freeShippingThreshold: 5000000,
  shippingCost: 49000,

  products: [
    { id:'p1', name:'گوشی موبایل سامسونگ مدل Galaxy S24 ظرفیت ۲۵۶ گیگابایت', category:'mobiles', brand:'سامسونگ',
      price:38900000, discount:10, rating:4.6, reviewsCount:128, stock:7,