import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-[#f5f0eb]">
      <header className="border-b border-white/[0.04] h-16 flex items-center bg-[#0a0a0a]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="rounded-lg bg-[#c9a87c]/10 px-2.5 py-1 text-lg font-bold tracking-[-0.06em] text-[#c9a87c] ring-1 ring-[#c9a87c]/20">TB</span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#f5f0eb]">Trox Box</span>
          </Link>
          <nav className="flex gap-6 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8a8580]">
            <Link href="/" className="hover:text-[#f5f0eb] transition-colors">Home</Link>
            <Link href="/about" className="text-[#f5f0eb]">About</Link>
            <Link href="/contact" className="hover:text-[#f5f0eb] transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-20 flex-grow space-y-12">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#c9a87c] hover:text-[#e0c9a6] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Store
          </Link>
          <span className="block text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a87c]">Our Heritage</span>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#f5f0eb]">Engineering Premium Wardrobe Staples</h1>
          <div className="h-px w-16 bg-[#c9a87c]/40" />
        </div>

        <section className="space-y-8 text-sm text-[#8a8580] leading-7">
          <p>
            Established in 2026, Trox Box was founded on a simple dissatisfaction with fast fashion. Clothes should not be designed to be discarded. They should be built as reliable daily components, providing premium style, comfort, and timeless durability.
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#f5f0eb]">Conscious Materials</h3>
            <p>
              Every thread matters. We manufacture our hoodies and tees using custom-milled organic French Terry cotton that weighs a substantial 450GSM. This guarantees a heavy, structured fit that maintains its softness wash after wash. Our denim jeans utilize dynamic high-stretch cotton blends to blend structural style with modern mobility.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#f5f0eb]">Ethical Manufacturing</h3>
            <p>
              We maintain intimate relationships with our partner boutique workshops in California and Portugal. By conducting regular audits and paying living wages well above the local averages, we ensure that the craftsmanship and care that goes into our stitching comes from a positive, equitable working environment.
            </p>
          </div>
        </section>

        <div className="pt-8 text-center border-t border-white/[0.04]">
          <Link
            href="/"
            className="btn-luxury inline-block bg-[#c9a87c] text-[#0a0a0a] font-bold px-8 py-3.5 rounded-xl text-sm"
          >
            Shop the Collection
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] py-8 text-center text-[11px] text-[#5a5550]">
        <p>&copy; 2026 Trox Box Clothing Brand. All rights reserved.</p>
      </footer>
    </div>
  );
}
