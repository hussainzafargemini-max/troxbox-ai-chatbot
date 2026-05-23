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
    gradient: 'from-zinc-800 via-indigo-950 to-zinc-950',
    badge: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Classic Heavyweight Tee',
    category: 'T-Shirts',
    price: '$38.00',
    color: 'Alabaster White',
    gradient: 'from-zinc-100 via-indigo-100 to-zinc-300',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Premium Stretch Slim Jeans',
    category: 'Denim',
    price: '$110.00',
    color: 'Raw Indigo',
    gradient: 'from-blue-900 via-indigo-900 to-slate-950',
    badge: 'Tailored Fit',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Urban Minimalist Bomber Jacket',
    category: 'Outerwear',
    price: '$145.00',
    color: 'Olive Drab',
    gradient: 'from-emerald-950 via-zinc-900 to-stone-950',
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Cozy Fleece Trackpants',
    category: 'Loungewear',
    price: '$65.00',
    color: 'Heather Gray',
    gradient: 'from-zinc-300 via-indigo-200 to-zinc-500',
    badge: 'Soft Touch',
    image:
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Retro Knit Ribbed Beanie',
    category: 'Accessories',
    price: '$28.00',
    color: 'Burnt Orange',
    gradient: 'from-amber-600 via-orange-800 to-amber-950',
    badge: 'Drop',
    image:
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  },
];

const heroSlides = [
  {
    label: 'Oversized Hoodie',
    meta: 'Carbon Black / Heavy Terry',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
  },
  {
    label: 'Premium Denim',
    meta: 'Raw Indigo / Stretch Fit',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    label: 'Bomber Layer',
    meta: 'Olive Drab / Water Resistant',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
  },
  {
    label: 'Heavyweight Tee',
    meta: 'Alabaster White / 240 GSM',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="group flex items-center gap-2 focus:outline-none">
            <span className="rounded-xl bg-indigo-50 px-2.5 py-1 text-xl font-black tracking-tighter text-indigo-600 ring-1 ring-indigo-100 transition-transform group-hover:scale-105">
              TB
            </span>
            <span className="text-lg font-extrabold tracking-tight text-zinc-950">TROX BOX</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-600 md:flex">
            <Link href="/" className="text-indigo-600 transition-colors hover:text-indigo-700">
              Home
            </Link>
            <a href="#catalog" className="transition-colors hover:text-indigo-600">
              Catalog
            </a>
            <Link href="/about" className="transition-colors hover:text-indigo-600">
              About Us
            </Link>
            <Link href="/contact" className="transition-colors hover:text-indigo-600">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-white hover:shadow-sm active:scale-95"
            >
              Admin Panel
            </Link>
            <a
              href="#catalog"
              className="hidden items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-black text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-95 sm:flex"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Shop Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* Premium 3D Hero Section */}
      <section className="relative isolate overflow-hidden bg-zinc-950 px-5 py-20 text-white sm:px-6 sm:py-28 lg:py-32">
        <div className="absolute inset-0 -z-20 opacity-[0.11] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(99,102,241,0.25),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(168,85,247,0.24),transparent_34%),linear-gradient(115deg,rgba(15,23,42,0.96),rgba(3,7,18,0.98))]" />
        <div className="absolute left-1/2 top-16 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.02] blur-0" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-indigo-200 shadow-2xl shadow-indigo-900/20">
              <Sparkles className="h-3.5 w-3.5" />
              New SS26 Motion Capsule
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[0.88] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              Streetwear,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300">
                built in 3D.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              Premium contemporary essentials with cinematic movement, clean silhouettes, and support built into every order experience.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#catalog"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-zinc-950 shadow-2xl shadow-white/10 transition-all hover:-translate-y-1 hover:bg-indigo-50 active:scale-95"
              >
                Explore Capsule
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-black/20 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/15 active:scale-95"
              >
                View Brand Story
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <span className="block text-2xl font-black text-white">6</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Capsule pieces</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <span className="block text-2xl font-black text-white">30D</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Return window</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <span className="block text-2xl font-black text-white">24/7</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">AI support</span>
              </div>
            </div>
          </div>

          <div className="tb-hero-stage relative mx-auto h-[430px] w-full max-w-[620px] sm:h-[540px]">
            <div className="tb-hero-glow" />
            <div className="tb-hero-orbit" aria-hidden="true">
              {heroSlides.map((slide, index) => (
                <div className="tb-hero-card" key={slide.label} style={{ '--i': index } as React.CSSProperties}>
                  <div
                    className="tb-hero-card-image"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(3,7,18,0.04), rgba(3,7,18,0.72)), url(${slide.image})`,
                    }}
                  />
                  <div className="tb-hero-card-meta">
                    <span>{slide.label}</span>
                    <small>{slide.meta}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="tb-hero-device">
              <div className="tb-device-top">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div
                className="tb-device-image"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(3,7,18,0.12), rgba(3,7,18,0.76)), url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85)',
                }}
              />
              <div className="tb-device-content">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-200">Live Drop</span>
                  <h3 className="mt-1 text-2xl font-black tracking-tight text-white">Motion Capsule</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-right backdrop-blur">
                  <span className="block text-lg font-black">$38+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Starting</span>
                </div>
              </div>
            </div>

            <div className="tb-floating-chip tb-chip-one">
              <Layers3 className="h-4 w-4 text-indigo-300" />
              <span>3D Showcase</span>
            </div>
            <div className="tb-floating-chip tb-chip-two">
              <Zap className="h-4 w-4 text-violet-300" />
              <span>Auto Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Brand Highlights */}
      <section className="relative z-10 -mt-8 px-5 pb-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">Free Express Delivery</h4>
              <p className="mt-0.5 text-xs text-zinc-500">Complimentary shipping on orders over $75</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">30-Day Free Returns</h4>
              <p className="mt-0.5 text-xs text-zinc-500">Free return labeling for easy exchanges</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900">Premium Quality Guaranteed</h4>
              <p className="mt-0.5 text-xs text-zinc-500">Double-stitched cotton and durable finishes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="catalog" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.28em] text-indigo-600">Featured Capsule</span>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-zinc-950 sm:text-5xl">Premium catalog, sharper presentation.</h2>
          <p className="text-sm leading-6 text-zinc-500">
            Curated custom essentials crafted with heavyweight cotton, raw stretch denim, and clean daily-wear silhouettes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Story / Philosophy */}
      <section className="border-y border-zinc-100 bg-zinc-50 px-5 py-20 text-zinc-800 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-xl shadow-zinc-900/5 sm:p-12">
          <span className="text-[11px] font-black uppercase tracking-[0.28em] text-indigo-600">Brand Philosophy</span>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] text-zinc-950 sm:text-4xl">
            Ethically Engineered. Consciously Designed.
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600">
            Trox Box rejects disposable fast-fashion. Every jacket, tee, and hoodie is built for long-term wear with durable stitching, controlled sizing, and a cleaner support experience after purchase.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-zinc-50 p-6">
              <span className="block text-4xl font-black text-indigo-600">100%</span>
              <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Quality Controlled</span>
            </div>
            <div className="rounded-3xl bg-zinc-50 p-6">
              <span className="block text-4xl font-black text-indigo-600">SS26</span>
              <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Capsule Launch</span>
            </div>
            <div className="rounded-3xl bg-zinc-50 p-6">
              <span className="block text-4xl font-black text-indigo-600">AI</span>
              <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Support Layer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 px-5 pb-8 pt-16 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-b border-zinc-800 pb-12 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold tracking-wider text-indigo-400">TROX BOX</h4>
            <p className="text-xs leading-relaxed text-zinc-400">
              Curating luxury contemporary minimal streetwear for daily wear since 2026. Custom-tailored fits with AI-powered support.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Support Pages</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/about" className="transition-colors hover:text-indigo-400">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-indigo-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="#catalog" className="transition-colors hover:text-indigo-400">
                  Catalog Shop
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Store Hours</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
              <li>Saturday: 10:00 AM - 4:00 PM EST</li>
              <li>Sunday: Closed (Online Chat 24/7)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Quick Audit Access</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/admin/login" className="transition-colors hover:text-indigo-400">
                  System Admin Login
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="transition-colors hover:text-indigo-400">
                  Management Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>© 2026 Trox Box Clothing Brand. All rights reserved.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <a href="#" className="transition-colors hover:text-zinc-300">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-zinc-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
