import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Search, Utensils, X } from 'lucide-react';
import {
  CATEGORY_INTROS,
  MENU_PRODUCTS,
  MenuCategory,
  MenuProduct,
  SITE_IMAGES,
} from './data/menu';

interface CartItem extends MenuProduct {
  quantity: number;
}

const CATEGORIES: { label: string; value: MenuCategory }[] = [
  { label: 'All items', value: 'All' },
  { label: 'South Indian', value: 'South Indian' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Drinks', value: 'Drinks' },
];

function DishImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-[#efe6da] text-[#654334] p-4 text-center ${className}`}
      >
        <Utensils className="w-6 h-6 opacity-60" aria-hidden="true" />
        <span className="font-serif-display text-sm font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('#home');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const [emailInput, setEmailInput] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState(
    'By subscribing, you agree to receive our little updates.'
  );
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const [dailyQuote, setDailyQuote] = useState(
    'Good things take time. Enjoy every little bite.'
  );

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  };

  useEffect(() => {
    let active = true;
    async function loadDailyQuote() {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error('Quote service unavailable');
        const data = await response.json();
        if (active && data?.quote) {
          setDailyQuote(`“${data.quote}”`);
        }
      } catch {
        if (active) {
          setDailyQuote('Good things take time. Enjoy every little bite.');
        }
      }
    }
    loadDailyQuote();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return MENU_PRODUCTS.filter((item) => {
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (product: MenuProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to your bag`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleViewAll = () => {
    setActiveCategory('All');
    setSearchTerm('');
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckoutOpen = () => {
    if (cart.length === 0) {
      showToast('Add a little something sweet first!');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();

    if (name.length < 2) {
      setCheckoutError('Please enter your name.');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setCheckoutError('Enter a valid 10-digit phone number.');
      return;
    }
    if (address.length < 5) {
      setCheckoutError('Please add a pickup or delivery note.');
      return;
    }

    setCheckoutError('');
    setIsCheckoutOpen(false);
    showToast(`Thank you, ${name}! Demo order placed · ₹${cartSubtotal}`);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!validEmail) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    setNewsletterStatus('success');
    setNewsletterMessage("You're on the list! A little sweetness is coming your way.");
    setEmailInput('');
  };

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#menu', label: 'Our menu' },
    { href: '#story', label: 'Our story' },
    { href: '#visit', label: 'Visit us' },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      {/* Slim announcement banner */}
      <div className="bg-[var(--brown)] text-[#f8eee2] text-center py-2.5 px-3 text-[10px] tracking-[0.13em] uppercase">
        A little treat makes every day sweeter{' '}
        <span className="text-[#e7a27e] px-2.5" aria-hidden="true">
          ✦
        </span>{' '}
        Freshly made, always with love
      </div>

      {/* Sticky 3-zone header */}
      <header className="sticky top-0 z-20 bg-[#fffdf9]/95 backdrop-blur-md border-b border-[#503728]/10">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 min-h-[76px] flex items-center justify-between gap-6">
          <a
            href="#home"
            onClick={() => setActiveNav('#home')}
            className="font-serif-display text-[24px] sm:text-[25px] leading-none tracking-[-0.04em] text-[var(--ink)] no-underline whitespace-nowrap shrink-0"
          >
            dessert <span className="text-[var(--rust)]">&amp;</span> soul
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveNav(item.href)}
                className={`text-[12px] whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  activeNav === item.href
                    ? 'text-[var(--rust)] font-medium'
                    : 'text-[#675a50] hover:text-[var(--rust)]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping bag"
              className="inline-flex items-center border border-[var(--line)] bg-transparent rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.04em] text-[var(--ink)] hover:border-[var(--rust)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Bag
              <span className="inline-grid place-items-center bg-[var(--rust)] text-white w-5 h-5 rounded-full ml-2 text-[10px] tabular-nums">
                {cartCount}
              </span>
              <span className="ml-1.5" aria-hidden="true">
                ↗
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-[var(--line)] text-[var(--ink)] cursor-pointer"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper)] px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveNav(item.href);
                  setMobileNavOpen(false);
                }}
                className="text-[13px] py-1 text-[#675a50] hover:text-[var(--rust)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* Hero section */}
        <section
          id="home"
          className="bg-[var(--cream)] relative overflow-hidden pt-12 pb-6 md:pt-[70px] md:pb-7"
        >
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-[6%] min-h-[460px]">
            <div>
              <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[var(--rust)]">
                <span className="w-[22px] h-px bg-[var(--rust)] inline-block" />
                YOUR HAPPY PLACE, SERVED DAILY
              </div>
              <h1 className="font-serif-display font-semibold text-[48px] sm:text-[60px] lg:text-[74px] leading-[1.02] tracking-[-0.035em] my-6 text-balance">
                Good days
                <br />
                start with <em className="text-[var(--rust)] font-medium">dessert.</em>
              </h1>
              <p className="max-w-[420px] text-[var(--muted)] text-[13px] leading-[1.9]">
                Handcrafted treats, slow coffee and little moments worth slowing
                down for. Come in hungry, leave a little happier.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-7">
                <a
                  href="#menu"
                  className="inline-flex items-center bg-[var(--ink)] text-white border border-[var(--ink)] px-5 py-3.5 text-[11px] font-semibold tracking-[0.03em] hover:bg-[var(--rust)] hover:border-[var(--rust)] transition-colors whitespace-nowrap"
                >
                  Explore the menu <span className="pl-4">↗</span>
                </a>
                <a
                  href="#story"
                  className="text-[var(--ink)] text-[11px] font-semibold border-b border-[#bba99a] pb-1 hover:text-[var(--rust)] transition-colors whitespace-nowrap"
                >
                  A taste of our story
                </a>
              </div>
              <div className="flex items-center gap-3 mt-10 md:mt-12 text-[10px] text-[var(--muted)]">
                <span className="tracking-[2px] text-[#c68a55]" aria-hidden="true">
                  ★★★★★
                </span>
                <span>Loved by sweet-tooths around town</span>
              </div>
            </div>

            <div className="relative h-[360px] sm:h-[400px] md:h-[440px]">
              <div className="absolute inset-[14px_12px_0_42px] border border-[#a07353]/50 rounded-t-full pointer-events-none" />
              <div className="absolute inset-[0_28px_18px_30px] rounded-t-full overflow-hidden bg-[#ebe1d4]">
                <DishImage
                  src={SITE_IMAGES.heroCake}
                  alt="Artisanal chocolate cake with fresh berries at Dessert & Soul"
                  className="w-full h-full object-cover saturate-[0.86]"
                />
              </div>
              <div className="absolute left-0 bottom-11 bg-[var(--paper)] px-4 py-3 flex items-center gap-3 shadow-[0_12px_30px_rgba(70,48,28,0.1)]">
                <span className="text-[26px] text-[var(--rust)] leading-none" aria-hidden="true">
                  ✳
                </span>
                <div>
                  <strong className="block font-serif-display font-semibold text-[12px]">
                    Made fresh
                  </strong>
                  <small className="block text-[9px] text-[var(--muted)] mt-0.5">
                    with all our heart
                  </small>
                </div>
              </div>
              <div className="absolute right-0 top-10 bg-[var(--rust)] text-white rounded-full w-[92px] h-[92px] grid place-content-center text-center text-[9px] leading-[1.45] tracking-[0.14em] rotate-12">
                SWEET
                <br />
                THINGS
                <br />
                INSIDE
              </div>
            </div>
          </div>

          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex justify-between text-[#9a8d82] text-[8px] tracking-[0.16em] mt-8">
            <span>01 / A LITTLE JOY IN EVERY BITE</span>
            <span>SCROLL TO DISCOVER ↓</span>
          </div>
        </section>

        {/* Menu section */}
        <section id="menu" className="py-20 md:py-[100px]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">
              <div>
                <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[var(--rust)]">
                  <span className="w-[22px] h-px bg-[var(--rust)] inline-block" />
                  THE GOOD STUFF
                </div>
                <h2 className="font-serif-display font-semibold text-[44px] md:text-[53px] leading-[1.04] tracking-[-0.03em] mt-4">
                  Made to make
                  <br />
                  <em className="text-[var(--rust)] font-medium">your day.</em>
                </h2>
              </div>
              <p className="max-w-[260px] text-[var(--muted)] leading-[1.8] text-[13px] md:mr-[4%] md:mb-1.5">
                From first coffee to last crumb, there&apos;s something lovely
                waiting for you.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line)] pb-4 mb-6">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Menu categories">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat.value)}
                      className={`px-4 py-2 rounded-full border text-[11px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--ink)] border-[var(--ink)] text-white font-medium'
                          : 'bg-transparent border-[var(--line)] text-[var(--muted)] hover:bg-[var(--ink)] hover:border-[var(--ink)] hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-2.5 border-b border-[var(--line)] py-1.5 text-[var(--rust)] w-full md:w-auto">
                <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Find your favourite..."
                  aria-label="Search menu"
                  className="border-0 outline-none bg-transparent text-[12px] text-[var(--ink)] placeholder:text-[var(--muted)] w-full md:w-[190px]"
                />
              </label>
            </div>

            <p className="font-serif-display italic text-[13px] text-[var(--muted)] mb-6">
              {CATEGORY_INTROS[activeCategory]}
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 md:gap-x-[22px] md:gap-y-[30px]">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="group min-w-0">
                    <div className="relative h-[190px] sm:h-[235px] md:h-[255px] overflow-hidden bg-[#efe6da]">
                      <DishImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-[#2c1c10]/[0.04] pointer-events-none" />
                      {product.tag && (
                        <span className="absolute top-3 left-3 z-10 bg-[#fffaf0] text-[var(--brown)] text-[8px] tracking-[0.1em] px-2.5 py-1.5 font-medium">
                          {product.tag}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to bag`}
                        className="absolute right-3 bottom-3 z-10 w-[38px] h-[38px] rounded-full bg-[var(--paper)] text-[var(--ink)] text-[22px] leading-none grid place-items-center shadow-sm hover:bg-[var(--rust)] hover:text-white hover:rotate-90 transition-all duration-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-3 pt-3.5">
                      <div className="min-w-0">
                        <h3 className="font-serif-display font-semibold text-[14px] sm:text-[15px] text-[var(--ink)] leading-snug mb-1">
                          {product.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-[var(--muted)] leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      <strong className="text-[12px] sm:text-[13px] font-semibold text-[var(--ink)] whitespace-nowrap tabular-nums">
                        ₹{product.price}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-[var(--muted)] font-serif-display text-[18px]">
                No menu items found. Try another search.
              </div>
            )}

            <div className="flex justify-between items-center border-t border-[var(--line)] mt-9 pt-5 text-[#a19489] text-[8px] tracking-[0.15em]">
              <span>FRESHLY PREPARED · MADE WITH CARE</span>
              <button
                type="button"
                onClick={handleViewAll}
                className="text-[var(--ink)] text-[11px] font-semibold border-b border-[#bba99a] pb-1 hover:text-[var(--rust)] transition-colors cursor-pointer tracking-normal"
              >
                View all treats ↗
              </button>
            </div>
          </div>
        </section>

        {/* Quote band */}
        <section className="bg-[#eee4d8] py-12">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex items-center justify-center gap-6 md:gap-8 relative">
            <span className="font-serif-display text-[68px] md:text-[90px] text-[#c58c70] leading-[0.7]" aria-hidden="true">
              “
            </span>
            <p className="font-serif-display font-medium text-[26px] sm:text-[32px] md:text-[35px] leading-[1.15] text-center m-0">
              Life is short. Make it
              <br />
              <em className="text-[var(--rust)] font-medium">a little sweeter.</em>
            </p>
            <span className="hidden md:block text-[8px] tracking-[0.15em] leading-[1.8] text-[var(--muted)] absolute right-6">
              A NOTE FROM OUR KITCHEN
              <br />
              WITH LOVE, ALWAYS ♥
            </span>
          </div>
        </section>

        {/* Story section */}
        <section id="story" className="py-20 md:py-[100px]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[10%] items-center">
            <div className="relative h-[360px] md:h-[430px]">
              <div className="absolute left-[8%] top-0 w-[66%] h-[300px] md:h-[360px] overflow-hidden bg-[#efe6da]">
                <DishImage
                  src={SITE_IMAGES.storyCafe}
                  alt="Cozy interior corner of Dessert & Soul cafe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[47%] h-[170px] md:h-[220px] border-[10px] border-[var(--paper)] overflow-hidden bg-[#efe6da]">
                <DishImage
                  src={SITE_IMAGES.storyCoffee}
                  alt="Freshly brewed coffee and warm pastries on wooden table"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute left-0 bottom-7 md:bottom-11 bg-[var(--rust)] text-white w-[95px] h-[95px] rounded-full grid place-content-center text-center font-serif-display text-[10px] leading-[1.5] tracking-[0.08em] -rotate-10">
                SINCE
                <br />
                DAY ONE
                <br />
                ♡
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[var(--rust)]">
                <span className="w-[22px] h-px bg-[var(--rust)] inline-block" />
                A LITTLE ABOUT US
              </div>
              <h2 className="font-serif-display font-semibold text-[44px] md:text-[53px] leading-[1.04] tracking-[-0.03em] mt-4 mb-5">
                Not just dessert.
                <br />
                <em className="text-[var(--rust)] font-medium">A feeling.</em>
              </h2>
              <p className="text-[12px] text-[var(--muted)] leading-[2] mb-3.5 max-w-[440px]">
                Dessert &amp; Soul began with one simple thought: the best moments
                in life are often the small ones. A warm pastry on a rainy
                afternoon. Coffee with your favourite person. One more bite,
                just because.
              </p>
              <p className="text-[12px] text-[var(--muted)] leading-[2] mb-4 max-w-[440px]">
                So we make everything with care, use ingredients we believe in,
                and save you a seat at our table.
              </p>
              <a
                href="#visit"
                className="inline-flex items-center border border-[#b9a99b] px-4 py-3 text-[11px] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)] transition-colors mt-2"
              >
                Come say hello <span className="pl-4">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Daily inspiration section */}
        <section className="bg-[var(--brown)] text-[#fff7ed] py-14">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div>
              <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[#e8b296]">
                <span className="w-[22px] h-px bg-[#e8b296] inline-block" />
                A LITTLE DAILY INSPIRATION
              </div>
              <h2 className="font-serif-display font-semibold text-[40px] md:text-[49px] leading-[1.04] tracking-[-0.03em] my-4">
                Sweet words,
                <br />
                <em className="text-[#e7a27e] font-medium">freshly served.</em>
              </h2>
              <p className="text-[#d5c2b3] font-serif-display italic text-[14px] max-w-[600px]">
                {dailyQuote}
              </p>
            </div>
            <div className="w-[110px] h-[110px] md:w-[125px] md:h-[125px] border border-[#b9937e] rounded-full grid place-content-center text-center text-[9px] leading-[1.6] tracking-[0.15em] rotate-9 text-[#e8c5ae] shrink-0">
              A DAILY
              <br />
              DOSE OF
              <br />
              <b className="text-[14px] text-white">HAPPY</b> ✳
            </div>
          </div>
        </section>

        {/* Visit & newsletter section */}
        <section id="visit" className="py-20 md:py-[100px]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[12%] items-center">
            <div>
              <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[var(--rust)]">
                <span className="w-[22px] h-px bg-[var(--rust)] inline-block" />
                YOUR TABLE IS WAITING
              </div>
              <h2 className="font-serif-display font-semibold text-[44px] md:text-[53px] leading-[1.04] tracking-[-0.03em] mt-4 mb-5">
                Drop by for
                <br />
                <em className="text-[var(--rust)] font-medium">something lovely.</em>
              </h2>
              <p className="text-[var(--muted)] text-[12px] leading-[1.8]">
                Whether it&apos;s a quick coffee or a long catch-up, we&apos;d love
                to see you.
              </p>
              <div className="flex flex-wrap gap-10 mt-9">
                <div>
                  <small className="block text-[var(--rust)] text-[8px] tracking-[0.15em] font-bold mb-2">
                    FIND US
                  </small>
                  <strong className="font-serif-display font-semibold text-[13px]">
                    Coimbatore, Tamil Nadu
                  </strong>
                </div>
                <div>
                  <small className="block text-[var(--rust)] text-[8px] tracking-[0.15em] font-bold mb-2">
                    OPENING HOURS
                  </small>
                  <strong className="font-serif-display font-semibold text-[13px]">
                    Every day · 10 AM – 9 PM
                  </strong>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              noValidate
              className="bg-[var(--cream)] p-7 sm:p-9"
            >
              <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[var(--rust)]">
                <span className="w-[22px] h-px bg-[var(--rust)] inline-block" />
                THE SWEET MAIL
              </div>
              <h3 className="font-serif-display font-semibold text-[32px] leading-[1.15] my-4">
                A little love
                <br />
                in your inbox.
              </h3>
              <p className="text-[var(--muted)] text-[11px] leading-[1.8]">
                New bakes, cosy updates and the occasional treat. No spam, promise.
              </p>
              <label
                htmlFor="emailInput"
                className="block text-[var(--muted)] text-[8px] tracking-[0.15em] font-bold mt-6 mb-2"
              >
                YOUR EMAIL ADDRESS
              </label>
              <div className="flex border-b border-[#bca99a]">
                <input
                  id="emailInput"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 min-w-0 border-0 bg-transparent outline-none py-3 text-[12px] text-[var(--ink)]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="border-0 bg-transparent text-[20px] text-[var(--rust)] px-2 cursor-pointer"
                >
                  ↗
                </button>
              </div>
              <small
                className={`block text-[10px] mt-3 ${
                  newsletterStatus === 'error'
                    ? 'text-[#b94b37]'
                    : newsletterStatus === 'success'
                    ? 'text-[#6b7959]'
                    : 'text-[#9b8c80]'
                }`}
              >
                {newsletterMessage}
              </small>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2e241f] text-[#e9ddd1] pt-9 pb-5">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 pb-7">
          <a
            href="#home"
            className="font-serif-display text-[24px] leading-none tracking-[-0.04em] text-[#fff7ed] no-underline"
          >
            dessert <span className="text-[var(--rust)]">&amp;</span> soul
            <small className="block font-sans-body font-semibold text-[8px] tracking-[2px] mt-2 text-[#b8a69a]">
              BAKED WITH A LITTLE MAGIC
            </small>
          </a>
          <p className="font-serif-display italic text-[13px] leading-[1.5] text-[#c8b7a9] m-0">
            Made with a little sugar
            <br />
            and a whole lot of soul. ♥
          </p>
          <a
            href="#home"
            className="text-[8px] tracking-[0.15em] text-[#e9ddd1] hover:text-white no-underline"
          >
            BACK TO TOP ↑
          </a>
        </div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 border-t border-[#51443b] pt-4 flex flex-wrap justify-between gap-3 text-[#a99587] text-[8px] tracking-[0.12em]">
          <span>© 2026 DESSERT &amp; SOUL</span>
          <span>FRESHLY MADE. ALWAYS WITH LOVE.</span>
          <span>INSTAGRAM · CONTACT</span>
        </div>
      </footer>

      {/* Cart drawer overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-[#1d130e]/45 z-30 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Slide-over bag drawer */}
      <aside
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
        className={`fixed z-40 right-0 top-0 h-full w-full max-w-[420px] bg-[var(--paper)] p-7 flex flex-col shadow-2xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between border-b border-[var(--line)] pb-5">
          <div>
            <small className="text-[8px] tracking-[0.16em] text-[var(--rust)] font-bold">
              YOUR LITTLE COLLECTION
            </small>
            <h2 className="font-serif-display font-semibold text-[30px] mt-2 mb-0">
              Your bag{' '}
              <span className="font-sans-body text-[12px] text-[var(--muted)] tabular-nums">
                ({cartCount})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="border-0 bg-transparent text-[28px] leading-none text-[var(--ink)] self-start cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto py-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3.5 border-b border-[var(--line)] gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <DishImage
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover shrink-0 bg-[#efe6da]"
                  />
                  <div className="min-w-0">
                    <strong className="block font-serif-display font-semibold text-[14px] truncate">
                      {item.name}
                    </strong>
                    <small className="block text-[var(--muted)] text-[10px] mt-1 tabular-nums">
                      ₹{item.price} each
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="border border-[var(--line)] bg-white w-7 h-7 grid place-items-center text-[13px] cursor-pointer"
                  >
                    −
                  </button>
                  <span className="tabular-nums text-[12px] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="border border-[var(--line)] bg-white w-7 h-7 grid place-items-center text-[13px] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-[var(--muted)] font-serif-display text-[18px] leading-[1.8] py-16">
              Your bag is feeling lonely.
              <br />
              <span className="font-sans-body text-[11px]">
                Let&apos;s find it something sweet.
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--line)] pt-5">
          <div className="flex justify-between text-[13px]">
            <span>Subtotal</span>
            <strong className="font-serif-display font-semibold text-[18px] tabular-nums">
              ₹{cartSubtotal}
            </strong>
          </div>
          <p className="text-[9px] text-[var(--muted)] my-2.5">
            Delivery charges, if any, are calculated at checkout.
          </p>
          <button
            type="button"
            onClick={handleCheckoutOpen}
            className="w-full bg-[var(--ink)] text-white border border-[var(--ink)] py-3.5 text-[11px] font-semibold tracking-[0.03em] hover:bg-[var(--rust)] hover:border-[var(--rust)] transition-colors cursor-pointer"
          >
            Continue to checkout ↗
          </button>
        </div>
      </aside>

      {/* Demo checkout modal */}
      {isCheckoutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkoutTitle"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCheckoutOpen(false);
          }}
          className="fixed z-50 inset-0 bg-[#1d130e]/55 grid place-items-center p-4"
        >
          <div className="relative bg-[var(--paper)] w-full max-w-[460px] p-7 sm:p-9 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Close checkout"
              className="absolute right-5 top-4 border-0 bg-transparent text-[28px] leading-none text-[var(--ink)] cursor-pointer"
            >
              ×
            </button>
            <div className="flex items-center gap-2.5 text-[9px] tracking-[0.18em] font-bold text-[var(--rust)]">
              <span className="w-[22px] h-px bg-[var(--rust)] inline-block" />
              ALMOST YOURS
            </div>
            <h2
              id="checkoutTitle"
              className="font-serif-display font-semibold text-[38px] sm:text-[42px] leading-[1.05] mt-3 mb-6"
            >
              One last little
              <br />
              <em className="text-[var(--rust)] font-medium">detail.</em>
            </h2>
            <form onSubmit={handleCheckoutSubmit} noValidate>
              <label
                htmlFor="customerName"
                className="block text-[8px] tracking-[0.14em] text-[var(--muted)] font-bold mt-3.5 mb-1.5"
              >
                YOUR NAME
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                required
                minLength={2}
                className="w-full border border-[var(--line)] bg-white p-2.5 text-[12px] outline-[var(--rust)]"
              />

              <label
                htmlFor="customerPhone"
                className="block text-[8px] tracking-[0.14em] text-[var(--muted)] font-bold mt-3.5 mb-1.5"
              >
                PHONE NUMBER
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile number"
                required
                className="w-full border border-[var(--line)] bg-white p-2.5 text-[12px] outline-[var(--rust)]"
              />

              <label
                htmlFor="customerAddress"
                className="block text-[8px] tracking-[0.14em] text-[var(--muted)] font-bold mt-3.5 mb-1.5"
              >
                PICKUP / DELIVERY NOTE
              </label>
              <textarea
                id="customerAddress"
                rows={2}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Tell us where to bring the happiness"
                required
                className="w-full border border-[var(--line)] bg-white p-2.5 text-[12px] outline-[var(--rust)]"
              />

              <p className="text-[#b94b37] text-[10px] min-h-[16px] my-2.5">
                {checkoutError}
              </p>
              <button
                type="submit"
                className="w-full bg-[var(--ink)] text-white border border-[var(--ink)] py-3.5 text-[11px] font-semibold tracking-[0.03em] hover:bg-[var(--rust)] hover:border-[var(--rust)] transition-colors cursor-pointer"
              >
                Place demo order ↗
              </button>
              <small className="block text-center text-[var(--muted)] text-[9px] mt-3">
                Demo checkout only — no payment will be collected.
              </small>
            </form>
          </div>
        </div>
      )}

      {/* Toast message */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed z-50 bottom-5 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-white px-5 py-3 text-[11px] transition-all duration-200 pointer-events-none ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}

