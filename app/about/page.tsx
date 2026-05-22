import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Navigation */}
      <header className="border-b border-gray-100 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tighter text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">TB</span>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">TROX BOX</span>
          </Link>
          <nav className="flex space-x-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/about" className="text-indigo-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-20 flex-grow space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Heritage</span>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Engineering Premium Wardrobe Staples</h1>
          <div className="h-1 w-16 bg-indigo-600 rounded-full" />
        </div>

        <section className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <p>
            Established in 2026, **Trox Box** was founded on a simple dissatisfaction with fast fashion. Clothes should not be designed to be discarded. They should be built as reliable daily components, providing premium style, comfort, and timeless durability.
          </p>

          <h3 className="text-lg font-bold text-gray-900 pt-4">Conscious Materials</h3>
          <p>
            Every thread matters. We manufacture our hoodies and tees using custom-milled organic French Terry cotton that weighs a substantial 450GSM. This guarantees a heavy, structured fit that maintains its softness wash after wash. Our denim jeans utilize dynamic high-stretch cotton blends to blend structural style with modern mobility.
          </p>

          <h3 className="text-lg font-bold text-gray-900 pt-4">Ethical Manufacturing</h3>
          <p>
            We maintain intimate relationships with our partner boutique workshops in California and Portugal. By conducting regular audits and paying living wages well above the local averages, we ensure that the craftsmanship and care that goes into our stitching comes from a positive, equitable working environment.
          </p>
        </section>

        {/* CTA */}
        <div className="pt-8 text-center border-t border-gray-100">
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all focus:outline-none"
          >
            Shop the Collection
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-500 py-8 text-center text-xs border-t border-zinc-900">
        <p>© 2026 Trox Box Clothing Brand. All rights reserved.</p>
      </footer>

    </div>
  );
}
