import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, RotateCcw, ShieldCheck, Sparkles, Layers3, Zap } from 'lucide-react';
import ProductCard, { ProductItem } from '@/components/ProductCard';

const products: ProductItem[] = [
  {
    id: 1,
    name: 'Signature Oversized Hoodie',
    category: 'Hoodies',
    price: '$85.00',
    color: 'Carbon Black',
    gradient: 'from-zinc-800 via-neutral-900 to-zinc-950',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Classic Heavyweight Tee',
    category: 'T-Shirts',
    price: '$38.00',
    color: 'Alabaster White',
    gradient: 'from-stone-200 via-stone-100 to-stone-300',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Premium Stretch Slim Jeans',
    category: 'Denim',
    price: '$110.00',
    color: 'Raw Indigo',
    gradient: 'from-blue-950 via-indigo-950 to-slate-950',
    badge: 'Tailored Fit',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Urban Minimalist Bomber',
    category: 'Outerwear',
    price: '$145.00',
    color: 'Olive Drab',
    gradient: 'from-emerald-950 via-zinc-900 to-stone-950',
    badge: 'Limited',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Cozy Fleece Trackpants',
    category: 'Loungewear',
    price: '$65.00',
    color: 'Heather Gray',
    gradient: 'from-zinc-400 via-zinc-500 to-zinc-600',
    badge: 'Soft Touch',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Retro Knit Ribbed Beanie',
    category: 'Accessories',
    price: '$28.00',
    color: 'Burnt Orange',
    gradient: 'from-amber-700 via-orange-900 to-amber-950',
    badge: 'Drop',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  },
];

const heroSlides = [
  { label: 'Oversized Hoodie', meta: 'Carbon Black / Heavy Terry', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85' },
  { label: 'Premium Denim', meta: 'Raw Indigo / Stretch Fit', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85' },
  { label: 'Bomber Layer', meta: 'Olive Drab / Water Resistant', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85' },
  { label: 'Heavyweight Tee', meta: 'Alabaster White / 240 GSM', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85' },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#f5f0eb]">
      {/* ═══════════════════════════════════════
          NAVIGATION
         ═══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
            <span className="rounded-lg bg-[#c9a87c]/10 px-2.5 py-1 text-lg font-bold tracking-[-0.06em] text-[#c9a87c] ring-1 ring-[#c9a87c]/20 transition-all group-hover:ring-[#c9a87c]/40">
              TB
            </span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#f5f0eb]">Trox Box</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8a8580] md:flex">
            <Link href="/" className="text-[#f5f0eb] transition-colors hover:text-[#c9a87c]">Home</Link>
            <a href="#catalog" className="transition-colors hover:text-[#f5f0eb]">Catalog</a>
            <Link href="/about" className="transition-colors hover:text-[#f5f0eb]">About</Link>
            <Link href="/contact" className="transition-colors hover:text-[#f5f0eb]">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#8a8580] transition-all hover:border-white/[0.12] hover:text-[#f5f0eb]"
            >
              Console
            </Link>
            <a
              href="#catalog"
              className="btn-luxury hidden items-center gap-1.5 rounded-lg bg-[#c9a87c] px-4 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-[#0a0a0a] sm:flex"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Shop Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          HERO SECTION — 3D CINEMATIC
         ═══════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden px-5 py-20 sm:px-6 sm:py-28 lg:py-36">
        {/* Background layers */}
        <div className="absolute inset-0 -z-20 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,168,124,0.12),transparent)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left content */}
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a87c]/20 bg-[#c9a87c]/[0.06] px-4 py-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#c9a87c]">
              <Sparkles className="h-3 w-3" />
              SS26 Motion Capsule
            </div>

            <h1 className="max-w-2xl text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[0.88] tracking-[-0.06em] text-[#f5f0eb]">
              Streetwear,
              <span className="block bg-gradient-to-r from-[#c9a87c] via-[#e0c9a6] to-[#c9a87c] bg-clip-text text-transparent">
                redefined.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#8a8580]">
              Premium contemporary essentials with cinematic movement, clean silhouettes, and AI-powered support built into every order experience.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#catalog"
                className="btn-luxury group inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5f0eb] px-7 py-4 text-sm font-bold tracking-[-0.01em] text-[#0a0a0a]"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/about"
                className="btn-luxury inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-4 text-sm font-semibold text-[#f5f0eb] backdrop-blur"
              >
                Brand Story
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-3">
              {[
                { val: '6', label: 'Capsule pieces' },
                { val: '30D', label: 'Return window' },
                { val: '24/7', label: 'AI support' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
                  <span className="block text-xl font-bold text-[#f5f0eb]">{stat.val}</span>
                  <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#5a5550]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D showcase */}
          <div className="hero-stage relative mx-auto h-[430px] w-full max-w-[620px] sm:h-[540px]">
            <div className="hero-glow" />
            <div className="hero-orbit" aria-hidden="true">
              {heroSlides.map((slide, index) => (
                <div className="hero-card" key={slide.label} style={{ '--i': index } as React.CSSProperties}>
                  <div
                    className="hero-card-image"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.05), rgba(10,10,10,0.7)), url(${slide.image})`,
                    }}
                  />
                  <div className="hero-card-meta">
                    <span>{slide.label}</span>
                    <small>{slide.meta}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-device">
              <div className="absolute left-4 top-4 z-10 flex gap-[6px]">
                <span className="h-2 w-2 rounded-full bg-[#f87171]/80" />
                <span className="h-2 w-2 rounded-full bg-[#fbbf24]/80" />
                <span className="h-2 w-2 rounded-full bg-[#4ade80]/80" />
              </div>
              <div
                className="hero-device-image"
                style={{
                  backgroundImage: 'linear-gradient(180deg, rgba(10,10,10,0.1), rgba(10,10,10,0.75)), url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85)',
                }}
              />
              <div className="hero-device-content">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#c9a87c]">Live Drop</span>
                  <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-[#f5f0eb]">Motion Capsule</h3>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-right backdrop-blur">
                  <span className="block text-base font-bold text-[#f5f0eb]">$38+</span>
                  <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#8a8580]">Starting</span>
                </div>
              </div>
            </div>

            <div className="hero-chip hero-chip-1">
              <Layers3 className="h-3.5 w-3.5 text-[#c9a87c]" />
              <span>3D Showcase</span>
            </div>
            <div className="hero-chip hero-chip-2">
              <Zap className="h-3.5 w-3.5 text-[#c9a87c]" />
              <span>Auto Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BRAND HIGHLIGHTS BAR
         ═══════════════════════════════════════ */}
      <section className="relative z-10 -mt-6 px-5 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Free Express Delivery', desc: 'Complimentary shipping on orders over $75' },
            { icon: RotateCcw, title: '30-Day Free Returns', desc: 'Free return labeling for easy exchanges' },
            { icon: ShieldCheck, title: 'Premium Quality Guaranteed', desc: 'Double-stitched cotton and durable finishes' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-white/[0.08] hover:bg-white/[0.04]">
              <div className="rounded-xl bg-[#c9a87c]/[0.08] p-3 text-[#c9a87c]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#f5f0eb]">{title}</h4>
                <p className="mt-0.5 text-[11px] text-[#5a5550]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRODUCT CATALOG
         ═══════════════════════════════════════ */}
      <section id="catalog" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a87c]">Featured Capsule</span>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#f5f0eb] sm:text-5xl">
            Premium essentials, refined.
          </h2>
          <p className="text-sm leading-6 text-[#5a5550]">
            Curated custom essentials crafted with heavyweight cotton, raw stretch denim, and clean daily-wear silhouettes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BRAND PHILOSOPHY
         ═══════════════════════════════════════ */}
      <section className="border-y border-white/[0.04] px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/[0.04] bg-white/[0.02] p-8 text-center backdrop-blur-sm sm:p-14">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a87c]">Brand Philosophy</span>
          <h3 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-[#f5f0eb] sm:text-4xl">
            Ethically Engineered. Consciously Designed.
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5a5550]">
            Trox Box rejects disposable fast-fashion. Every jacket, tee, and hoodie is built for long-term wear with durable stitching, controlled sizing, and a cleaner support experience after purchase.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { val: '100%', label: 'Quality Controlled' },
              { val: 'SS26', label: 'Capsule Launch' },
              { val: 'AI', label: 'Support Layer' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
                <span className="block text-3xl font-bold text-[#c9a87c]">{item.val}</span>
                <span className="mt-1 block text-[9px] font-semibold tracking-[0.15em] uppercase text-[#5a5550]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════ */}
      <footer className="mt-auto border-t border-white/[0.04] px-5 pb-8 pt-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-b border-white/[0.04] pb-12 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a87c]">Trox Box</h4>
            <p className="text-[11px] leading-relaxed text-[#5a5550]">
              Curating luxury contemporary minimal streetwear for daily wear since 2026. Custom-tailored fits with AI-powered support.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8a8580]">Pages</h4>
            <ul className="space-y-2 text-[11px] text-[#5a5550]">
              <li><Link href="/about" className="transition-colors hover:text-[#c9a87c]">Our Story</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[#c9a87c]">Contact Support</Link></li>
              <li><a href="#catalog" className="transition-colors hover:text-[#c9a87c]">Catalog</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8a8580]">Hours</h4>
            <ul className="space-y-2 text-[11px] text-[#5a5550]">
              <li>Mon — Fri: 9AM — 6PM EST</li>
              <li>Saturday: 10AM — 4PM EST</li>
              <li>Sunday: Closed (AI Chat 24/7)</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8a8580]">Admin</h4>
            <ul className="space-y-2 text-[11px] text-[#5a5550]">
              <li><Link href="/admin/login" className="transition-colors hover:text-[#c9a87c]">Console Login</Link></li>
              <li><Link href="/admin/dashboard" className="transition-colors hover:text-[#c9a87c]">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between pt-8 text-[11px] text-[#5a5550] sm:flex-row">
          <p>&copy; 2026 Trox Box Clothing Brand. All rights reserved.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <a href="#" className="transition-colors hover:text-[#8a8580]">Privacy</a>
            <a href="#" className="transition-colors hover:text-[#8a8580]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
