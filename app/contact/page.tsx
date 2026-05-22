import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
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
            <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
            <Link href="/contact" className="text-indigo-600 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex-grow w-full">
        
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Support Center</span>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">We Are Here To Help</h1>
          <div className="h-1 w-16 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-xs sm:text-sm text-gray-500">
            Have questions about an order fit, tracking, or refunds? Reach out to our human staff below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Support Channels Card */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Contact Channels</h3>
            
            <div className="space-y-4">
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Email Support</h4>
                  <p className="text-xs text-gray-500 mt-0.5">support@troxbox.com</p>
                  <p className="text-[10px] text-gray-400 mt-1">Average response time: &lt; 4 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Customer Hotline</h4>
                  <p className="text-xs text-gray-500 mt-0.5">1-800-555-TROX (8769)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Available Mon-Fri 9:00 AM - 6:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Design Studio HQ</h4>
                  <p className="text-xs text-gray-500 mt-0.5">120 SoHo Broadway, Suite 400</p>
                  <p className="text-xs text-gray-500">New York, NY 10012</p>
                </div>
              </div>

            </div>
          </div>

          {/* Operational Details Card */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-gray-900 text-base">Operational Hours</h3>
            </div>
            
            <div className="space-y-3.5 text-xs text-gray-600 border-b border-gray-200/60 pb-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Monday - Friday</span>
                <span className="font-bold text-gray-800">9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Saturday</span>
                <span className="font-bold text-gray-800">10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Sunday</span>
                <span className="font-bold text-gray-800">Closed (24/7 AI Chat online)</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 leading-relaxed">
              <p>
                *For instant help on order tracking, product sizing, or return policies, simply click the **floating chat button** in the bottom-right of your screen to speak to **TroxBot**, our official AI customer support assistant! It resolves over 90% of shopping inquiries instantly.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-500 py-8 text-center text-xs border-t border-zinc-900">
        <p>© 2026 Trox Box Clothing Brand. All rights reserved.</p>
      </footer>

    </div>
  );
}
