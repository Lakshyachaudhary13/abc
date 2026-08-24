import React, { useState } from 'react';
import { UtensilsCrossed, ShoppingBag, Flame, Calendar, Clock, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';

export const RestaurantDemo: React.FC<{ onSelectThisDemo?: () => void }> = ({ onSelectThisDemo }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pizza' | 'burger' | 'beverage'>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<{ [id: string]: number }>({ 'p-1': 1, 'p-3': 2 });
  const [showTableModal, setShowTableModal] = useState(false);

  const menuItems = [
    { id: 'p-1', name: 'Wood-fired Farmhouse Pizza', category: 'pizza', price: 349, isVeg: true, rating: '4.9 ★', desc: 'Fresh mozzarella, bell peppers, sweet corn, black olives & basil' },
    { id: 'p-2', name: 'Smoky BBQ Chicken Supreme', category: 'pizza', price: 429, isVeg: false, rating: '4.8 ★', desc: 'Chargrilled peri-peri chicken, jalapeños & molten smoked cheese' },
    { id: 'p-3', name: 'Crispy Truffle Double Burger', category: 'burger', price: 219, isVeg: true, rating: '4.7 ★', desc: 'Herb patty, garlic aioli, caramelized onions in brioche bun' },
    { id: 'p-4', name: 'Grilled Juicy Lamb Burger', category: 'burger', price: 289, isVeg: false, rating: '4.9 ★', desc: 'Tender spiced lamb patty with cheddar slice & smoky chipotle' },
    { id: 'p-5', name: 'Belgian Chocolate Hazelnut Shake', category: 'beverage', price: 179, isVeg: true, rating: '5.0 ★', desc: 'Thick creamy shake with roasted hazelnuts & dark chocolate drizzle' },
    { id: 'p-6', name: 'Iced Passionfruit Mint Cooler', category: 'beverage', price: 139, isVeg: true, rating: '4.6 ★', desc: 'Sparkling cooler with fresh crushed mint & lemon wedges' },
  ];

  const updateCart = (id: string, delta: number) => {
    const current = cart[id] || 0;
    const next = current + delta;
    if (next <= 0) {
      const copy = { ...cart };
      delete copy[id];
      setCart(copy);
    } else {
      setCart({ ...cart, [id]: next });
    }
  };

  const filteredMenu = menuItems.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchVeg = vegOnly ? item.isVeg : true;
    return matchCat && matchVeg;
  });

  const cartTotal = (Object.entries(cart) as [string, number][]).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const cartCount = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div id="restaurant-demo" className="bg-stone-950 text-stone-100 font-sans min-h-[600px] rounded-xl overflow-hidden border border-stone-800">
      {/* Top Header */}
      <div className="bg-stone-900/90 px-6 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black shadow-md shadow-red-600/30">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-wide">Urban Crust Cafe & Pizzeria</span>
            <p className="text-[11px] text-amber-400">Authentic Italian Woodfired & Gourmet Bites</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTableModal(true)}
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-stone-700 flex items-center gap-1"
          >
            <Calendar className="w-3 h-3 text-red-400" /> Book Table
          </button>
          {onSelectThisDemo && (
            <button
              onClick={onSelectThisDemo}
              className="text-xs bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Get Cafe Site (₹2,499)
            </button>
          )}
        </div>
      </div>

      {/* Menu & Cart Container */}
      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Menu */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-800">
              {(['all', 'pizza', 'burger', 'beverage'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-md capitalize transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'Full Menu' : cat}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="text-emerald-400 font-medium">🌱 Veg Only</span>
            </label>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredMenu.map(item => {
              const qty = cart[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="bg-stone-900/70 border border-stone-800 hover:border-stone-700 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                        item.isVeg ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </span>
                      <span className="text-[11px] font-bold text-amber-400">{item.rating}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{item.name}</h4>
                    <p className="text-xs text-stone-400 my-2 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                    <span className="font-mono font-black text-white text-sm">₹{item.price}</span>

                    {qty === 0 ? (
                      <button
                        onClick={() => updateCart(item.id, 1)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-stone-800 border border-stone-700 px-2 py-0.5 rounded-lg">
                        <button onClick={() => updateCart(item.id, -1)} className="text-stone-300 hover:text-white p-0.5 cursor-pointer">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-white text-xs min-w-3 text-center">{qty}</span>
                        <button onClick={() => updateCart(item.id, 1)} className="text-stone-300 hover:text-white p-0.5 cursor-pointer">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Cart Order Summary */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between h-fit sticky top-20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-red-500" /> Current Order ({cartCount})
              </h3>
              {cartCount > 0 && (
                <button
                  onClick={() => setCart({})}
                  className="text-[11px] text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {cartCount === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                Your cart is empty. Add items from the menu.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {(Object.entries(cart) as [string, number][]).map(([id, qty]) => {
                  const item = menuItems.find(m => m.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-[11px] text-stone-400">₹{item.price} × {qty}</p>
                      </div>
                      <span className="font-mono font-bold text-stone-200">₹{item.price * qty}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-800 mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>Total Bill</span>
              <span className="font-mono text-base text-red-400">₹{cartTotal}</span>
            </div>

            <button
              disabled={cartCount === 0}
              onClick={() => {
                alert(`Order for ₹${cartTotal} sent via WhatsApp to restaurant manager!`);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              Order on WhatsApp (₹{cartTotal})
            </button>
          </div>
        </div>
      </div>

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-xl max-w-sm w-full p-6 text-stone-200 relative">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" /> Book a Table at Urban Crust
            </h3>
            <p className="text-xs text-stone-400 mb-4">Reserve a VIP table for birthday, family dining, or date night.</p>
            <div className="space-y-3 mb-4 text-xs">
              <input type="text" placeholder="Your Name" defaultValue="Vikramaditya" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-lg text-white" />
              <input type="text" placeholder="Number of Guests" defaultValue="4 Guests" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-lg text-white" />
              <input type="text" placeholder="Date & Time" defaultValue="Today, 8:00 PM" className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-lg text-white" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Table reservation confirmed for 4 Guests at 8:00 PM!');
                  setShowTableModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg cursor-pointer"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowTableModal(false)}
                className="px-3 bg-stone-800 text-stone-300 text-xs py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
