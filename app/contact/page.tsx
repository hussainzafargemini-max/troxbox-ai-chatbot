import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
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
            <Link href="/about" className="hover:text-[#f5f0eb] transition-colors">About</Link>
            <Link href="/contact" className="text-[#f5f0eb]">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 flex-grow w-full">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#c9a87c] hover:text-[#e0c9a6] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Store
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a87c]">Support Center</span>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#f5f0eb]">We Are Here To Help</h1>
          <div className="h-px w-16 bg-[#c9a87c]/40 mx-auto" />
          <p className="text-sm text-[#5a5550]">
            Have questions about an order fit, tracking, or refunds? Reach out to our team below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#f5f0eb]">Contact Channels</h3>
            {[
              { icon: Mail, title: 'Email Support', primary: 'support@troxbox.com', sub: 'Average response time: < 4 hours' },
              { icon: Phone, title: 'Customer Hotline', primary: '1-800-555-TROX (8769)', sub: 'Available Mon-Fri 9:00 AM - 6:00 PM EST' },
              { icon: MapPin, title: 'Design Studio HQ', primary: '120 SoHo Broadway, Suite 400', sub: 'New York, NY 10012' },
            ].map(({ icon: Icon, title, primary, sub }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.02]">
                <div className="p-3 bg-[#c9a87c]/[0.08] text-[#c9a87c] rounded-xl">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#f5f0eb] text-xs">{title}</h4>
                  <p className="text-[11px] text-[#8a8580] mt-0.5">{primary}</p>
                  <p className="text-[10px] text-[#5a5550] mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 space-y-6">
            <div className="flex items-center gap-2 text-[#c9a87c]">
              <Clock className="w-4 h-4" />
              <h3 className="font-bold text-[#f5f0eb] text-sm">Operational Hours</h3>
            </div>
            <div className="space-y-3 text-[11px] text-[#8a8580] border-b border-white/[0.04] pb-6">
              {[
                ['Monday — Friday', '9:00 AM — 6:00 PM EST'],
                ['Saturday', '10:00 AM — 4:00 PM EST'],
                ['Sunday', 'Closed (24/7 AI Chat online)'],
              ].map(([day, time]) => (
                <div key={day} className="flex justify-between">
                  <span className="text-[#5a5550]">{day}</span>
                  <span className="font-semibold text-[#f5f0eb]">{time}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#5a5550] leading-relaxed">
              For instant help on order tracking, product sizing, or return policies, click the floating chat button to speak to TroxBot, our AI customer support assistant.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] py-8 text-center text-[11px] text-[#5a5550]">
        <p>&copy; 2026 Trox Box Clothing Brand. All rights reserved.</p>
      </footer>
    </div>
  );
}
