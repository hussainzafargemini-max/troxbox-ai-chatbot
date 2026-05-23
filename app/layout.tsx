import type { Metadata } from 'next';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

export const metadata: Metadata = {
  title: 'TROX BOX | Premium Contemporary Apparel & Streetwear',
  description: 'Style. Comfort. Trox Box. Explore our curated catalog of contemporary streetwear, premium hoodies, classic oversized tees, and luxury denim jeans. Handcrafted fits for the modern wardrobe.',
  keywords: ['Trox Box', 'clothing brand', 'streetwear', 'premium hoodies', 'unisex apparel', 'denim jeans'],
  authors: [{ name: 'Trox Box Creative Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'TROX BOX | Premium Contemporary Apparel',
    description: 'Style. Comfort. Trox Box. High-quality minimal streetwear crafted for daily fit.',
    url: 'https://troxbox.com',
    siteName: 'TROX BOX',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col grain-overlay">
        <div className="flex-grow">{children}</div>
        <ChatWidget />
      </body>
    </html>
  );
}
