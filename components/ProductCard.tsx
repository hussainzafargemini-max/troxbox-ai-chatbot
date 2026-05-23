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
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-64 overflow-hidden rounded-t-2xl bg-zinc-100">
        {!imageFailed ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${product.gradient} flex items-center justify-center`}
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
              Trox Box
            </span>
          </div>
        )}

        <span className="absolute top-4 left-4 bg-white/95 text-zinc-900 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase shadow-sm">
          {product.category}
        </span>

        {product.badge && (
          <span className="absolute top-4 right-4 bg-indigo-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">{product.color}</span>
            <span className="text-sm font-black text-indigo-600">{product.price}</span>
          </div>
          <h3 className="text-base font-extrabold text-gray-800 mt-1">{product.name}</h3>
        </div>

        <button
          type="button"
          className="w-full bg-zinc-900 hover:bg-indigo-600 active:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none"
          title="Add to Shopping Cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
