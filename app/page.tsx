import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
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
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
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
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Premium Stretch Slim Jeans',
    category: 'Denim',
    price: '$110.00',
    color: 'Raw Indigo',
    gradient: 'from-blue-900 via-indigo-900 to-slate-950',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Urban Minimalist Bomber Jacket',
    category: 'Outerwear',
    price: '$145.00',
    color: 'Olive Drab',
    gradient: 'from-olive-800 via-zinc-900 to-emerald-950',
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Cozy Fleece Trackpants',
    category: 'Loungewear',
    price: '$65.00',
    color: 'Heather Gray',
    gradient: 'from-zinc-300 via-indigo-200 to-zinc-500',
    image:
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Retro Knit Ribbed Beanie',
    category: 'Accessories',
    price: '$28.00',
    color: 'Burnt Orange',
    gradient: 'from-amber-600 via-orange-800 to-amber-950',
    image:
      'https://images.unsplash.com/photo-1576871334176-52ef066602cf?auto=format&fit=crop&w=800&q=80',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center space-x-2 focus:outline-none">
            <span className="text-xl font-black tracking-tighter text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">TB</span>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">TROX BOX</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 transition-colors">Home</Link>
            <a href="#catalog" className="hover:text-indigo-600 transition-colors">Catalog</a>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard" 
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-gray-50 active:bg-gray-100 transition-all focus:outline-none"
            >
              Admin Panel
            </Link>
            <a 
              href="#catalog"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-1.5 text-xs font-bold shadow-md hover:scale-[1.03] active:scale-95 transition-all flex items-center space-x-1.5 focus:outline-none"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Now</span>
            </a>
          </div>

        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-24 sm:py-32 px-6">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating gradient orb */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-block bg-indigo-900/30 text-indigo-300 border border-indigo-500/20 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            New SS26 Collection
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
            Style. Comfort. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Trox Box.</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            Premium contemporary streetwear and lounge clothing designed for absolute durability, comfort, and minimal lines. Elevate your everyday wardrobe.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#catalog"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 focus:outline-none"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/about"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center border border-white/10 focus:outline-none"
            >
              Our Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Key Brand Highlights */}
      <section className="py-12 bg-gray-50 border-b border-gray-100 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Free Express Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Complimentary shipping on orders over $75</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">30-Day Free Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5">Free return labeling for easy exchanges</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Premium Quality Guaranteed</h4>
              <p className="text-xs text-gray-500 mt-0.5">Sustainably built using double-stitched cotton</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section id="catalog" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Featured Capsule Catalog</h2>
          <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-xs sm:text-sm text-gray-500">
            Curated custom essentials. Crafted with heavy loopback Terry and raw stretch denim fabric.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Brand Story / Philosophy */}
      <section className="py-20 bg-zinc-50 border-t border-b border-zinc-100 px-6 text-zinc-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-2xl font-black text-zinc-950">Ethically Engineered. Consciously Designed.</h3>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            At Trox Box, we reject fast-fashion models. We believe in building garments that stand the test of time. Every single jacket, tee, and hoodie we manufacture is knit from 100% organic cotton, dyed using non-toxic inks, and sewn in fair-wage boutique facilities.
          </p>
          <div className="flex items-center justify-center space-x-12 pt-4">
            <div>
              <span className="block text-3xl font-black text-indigo-600 leading-none">100%</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Organic Cotton</span>
            </div>
            <div className="h-8 w-px bg-zinc-200" />
            <div>
              <span className="block text-3xl font-black text-indigo-600 leading-none">SS26</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Capsule Launch</span>
            </div>
            <div className="h-8 w-px bg-zinc-200" />
            <div>
              <span className="block text-3xl font-black text-indigo-600 leading-none">Free</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">US Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-zinc-800 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-800">
          
          <div className="space-y-4">
            <h4 className="font-extrabold tracking-wider text-sm text-indigo-400">TROX BOX</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Curating luxury contemporary minimal streetwear for daily wear since 2026. Custom-tailored fits.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs text-zinc-200 uppercase tracking-widest">Support Pages</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              <li><a href="#catalog" className="hover:text-indigo-400 transition-colors">Catalog Shop</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs text-zinc-200 uppercase tracking-widest">Store Hours</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
              <li>Saturday: 10:00 AM - 4:00 PM EST</li>
              <li>Sunday: Closed (Online Chat 24/7)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs text-zinc-200 uppercase tracking-widest">Quick Audit access</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/admin/login" className="hover:text-indigo-400 transition-colors">System Admin Login</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-indigo-400 transition-colors">Management Dashboard</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Trox Box Clothing Brand. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
