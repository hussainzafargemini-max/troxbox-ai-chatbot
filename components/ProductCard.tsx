'use client';

import React, { useState } from 'react';

export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: string;
  color: string;
  image: string;
  gradient: string;
  badge?: string;
}

export default function ProductCard({ product }: { product: ProductItem }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="product-card group flex flex-col overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02]">
      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-[#111]">
        {!imageFailed ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20">
              Trox Box
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Category tag */}
        <span className="absolute left-3 top-3 rounded-md bg-[#0a0a0a]/70 px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb] backdrop-blur-xl">
          {product.category}
        </span>

        {/* Badge */}
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-md bg-[#c9a87c] px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] uppercase text-[#0a0a0a]">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-grow flex-col justify-between gap-4 p-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[#5a5550]">{product.color}</span>
            <span className="text-sm font-bold text-[#c9a87c]">{product.price}</span>
          </div>
          <h3 className="mt-1.5 text-[15px] font-bold tracking-[-0.01em] text-[#f5f0eb]">{product.name}</h3>
        </div>

        <button
          type="button"
          className="btn-luxury w-full rounded-xl bg-white/[0.06] py-3 text-[11px] font-bold tracking-[0.1em] uppercase text-[#f5f0eb] transition-all hover:bg-[#c9a87c] hover:text-[#0a0a0a]"
          title="Add to Shopping Cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
