import React, { useState } from 'react';
import { ShoppingBag, Star, Zap, Heart, Check, Plus, Minus, ArrowRight } from 'lucide-react';

export const MiniShopDemo: React.FC<{ onSelectThisDemo?: () => void }> = ({ onSelectThisDemo }) => {
  const [cart, setCart] = useState<{ [id: string]: { qty: number; size: string } }>({
    'item-1': { qty: 1, size: 'L' }
  });
  const [selectedSize, setSelectedSize] = useState<{ [id: string]: string }>({
    'item-1': 'L',
    'item-2': 'M',
    'item-3': 'Free Size',
    'item-4': 'L'
  });

  const products = [
    {
      id: 'item-1',
      name: 'Oversized Heavyweight Cyber Hoodie',
      price: 1299,
      originalPrice: 2499,
      discount: '48% OFF',
      rating: 4.9,
      reviews: 184,
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'Matte Charcoal',
      tag: 'Bestseller'
    },
    {
      id: 'item-2',
      name: 'Minimalist Cargo Track Pants',
      price: 899,
      originalPrice: 1799,
      discount: '50% OFF',
      rating: 4.8,
      reviews: 92,
      sizes: ['S', 'M', 'L'],
      color: 'Olive Military',
      tag: 'Trending'
    },
    {
      id: 'item-3',
      name: 'Matte Black Stainless Steel Watch',
      price: 1499,
      originalPrice: 3200,
      discount: '53% OFF',
      rating: 5.0,
      reviews: 310,
      sizes: ['Free Size'],
      color: 'Obsidian Black',
      tag: 'Premium'
    },
    {
      id: 'item-4',
      name: 'Urban Streetwear Graphic Tee',
      price: 599,
      originalPrice: 1199,
      discount: '50% OFF',
      rating: 4.7,
      reviews: 140,
      sizes: ['M', 'L', 'XL'],
      color: 'Acid Wash',
      tag: 'Hot Drop'
    }
  ];

  const toggleCart = (id: string) => {
    if (cart[id]) {
      const copy = { ...cart };
      delete copy[id];
      setCart(copy);
    } else {
      setCart({ ...cart, [id]: { qty: 1, size: selectedSize[id] || 'M' } });
    }
  };

  const updateQty = (id: string, delta: number) => {
    if (!cart[id]) return;
    const next = cart[id].qty + delta;
    if (next <= 0) {
      const copy = { ...cart };
      delete copy[id];
      setCart(copy);
    } else {
      setCart({ ...cart, [id]: { ...cart[id], qty: next } });
    }
  };

  const totalItems = (Object.values(cart) as { qty: number; size: string }[]).reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = (Object.entries(cart) as [string, { qty: number; size: string }][]).reduce((sum, [id, data]) => {
    const prod = products.find(p => p.id === id);
    return sum + (prod ? prod.price * data.qty : 0);
  }, 0);

  return (
    <div id="mini-shop-demo" className="bg-zinc-950 text-zinc-100 font-sans min-h-[600px] rounded-xl overflow-hidden border border-zinc-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 text-white font-bold text-xs flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-white" /> FLASH SALE: Flat 50% OFF + Free Delivery Across India
        </span>
        <span className="hidden sm:inline-block text-[11px] bg-black/20 px-2 py-0.5 rounded-full">
          Use Code: DROP50
        </span>
      </div>

      {/* Header */}
      <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-black">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight">ZapTrends Fashion</span>
            <p className="text-[10px] text-fuchsia-400 font-mono">D2C Urban Streetwear Store</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs">
            <ShoppingBag className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-bold text-white">{totalItems} Items</span>
            <span className="text-zinc-400">| ₹{totalAmount}</span>
          </div>

          {onSelectThisDemo && (
            <button
              onClick={onSelectThisDemo}
              className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Get Shop Site (₹2,999)
            </button>
          )}
        </div>
      </div>

      {/* Store Container */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(p => {
            const inCart = !!cart[p.id];
            return (
              <div
                key={p.id}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-violet-500/50 rounded-xl p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                      {p.tag}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                      {p.discount}
                    </span>
                  </div>

                  <div className="h-28 rounded-lg bg-zinc-800/80 mb-3 flex flex-col items-center justify-center text-zinc-400 border border-zinc-700/50">
                    <ShoppingBag className="w-8 h-8 text-zinc-500 mb-1" />
                    <span className="text-[11px] text-zinc-400">{p.color}</span>
                  </div>

                  <h4 className="font-bold text-white text-xs leading-snug mb-1">{p.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 mb-2">
                    <Star className="w-3 h-3 fill-amber-400" /> {p.rating} ({p.reviews})
                  </div>

                  {/* Size Selector */}
                  <div className="flex gap-1 mb-3">
                    {p.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize({ ...selectedSize, [p.id]: size })}
                        className={`text-[10px] px-2 py-0.5 rounded border cursor-pointer ${
                          (selectedSize[p.id] || p.sizes[0]) === size
                            ? 'bg-violet-600 text-white border-violet-500 font-bold'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-mono font-black text-sm text-white">₹{p.price}</span>
                    <span className="font-mono text-xs text-zinc-500 line-through">₹{p.originalPrice}</span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-1">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(p.id, -1)} className="text-zinc-300 hover:text-white px-1.5 py-0.5 cursor-pointer">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs text-white">{cart[p.id].qty}</span>
                        <button onClick={() => updateQty(p.id, 1)} className="text-zinc-300 hover:text-white px-1.5 py-0.5 cursor-pointer">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-violet-400 font-mono pr-2">Added ✓</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleCart(p.id)}
                      className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Bag
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Checkout Bar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400">Total Cart Value ({totalItems} items):</p>
            <p className="text-lg font-black text-white font-mono">
              ₹{totalAmount} <span className="text-xs text-emerald-400 font-sans font-normal">(Free Fast Shipping)</span>
            </p>
          </div>

          <button
            onClick={() => {
              alert(`Order placed for ₹${totalAmount}! Redirecting customer to WhatsApp shop order flow...`);
            }}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
          >
            Order Instantly on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
