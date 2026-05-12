'use client';

import { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote } from 'lucide-react';

export default function CaissePage() {
  const [cart, setCart] = useState<{ id: number, nom: string, prix: number, qte: number }[]>([]);

  const addToCart = (item: { id: number, nom: string, prix: number, stock: number }) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qte: c.qte + 1 } : c));
    } else {
      setCart([...cart, { ...item, qte: 1 }]);
    }
  };

  const updateQte = (id: number, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQte = c.qte + delta;
        return newQte > 0 ? { ...c, qte: newQte } : c;
      }
      return c;
    }));
  };

  const remove = (id: number) => setCart(cart.filter(c => c.id !== id));

  const total = cart.reduce((acc, item) => acc + (item.prix * item.qte), 0);

  const mockMedicaments = [
    { id: 1, nom: 'Doliprane 1000mg', prix: 2.50, stock: 45 },
    { id: 2, nom: 'Amoxicilline 500mg', prix: 5.20, stock: 120 },
    { id: 3, nom: 'Spasfon', prix: 3.10, stock: 8 },
    { id: 4, nom: 'Ibuprofène 400mg', prix: 4.00, stock: 65 },
    { id: 5, nom: 'Smecta', prix: 4.50, stock: 30 },
    { id: 6, nom: 'Fervex', prix: 6.20, stock: 15 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] animate-fade-in">
      {/* Left Panel: Products */}
      <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-white/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Scanner un code-barres ou rechercher un produit..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium shadow-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockMedicaments.map((med) => (
              <button 
                key={med.id}
                onClick={() => addToCart(med)}
                className="flex flex-col items-start p-4 bg-white border border-border rounded-xl hover:border-primary-500 hover:ring-1 hover:ring-primary-500 transition-all text-left group"
              >
                <div className="w-full flex justify-between items-start mb-2">
                  <span className="font-semibold text-foreground line-clamp-2">{med.nom}</span>
                </div>
                <div className="mt-auto pt-4 w-full flex items-center justify-between">
                  <span className="text-primary-600 font-bold">{med.prix.toFixed(2)} €</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    Stock: {med.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="w-full lg:w-96 flex flex-col glass rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-primary-600 text-white flex items-center gap-3">
          <ShoppingCart size={20} />
          <h2 className="font-semibold">Panier Actuel</h2>
          <span className="ml-auto bg-white/20 px-2.5 py-0.5 rounded-full text-sm font-medium">
            {cart.reduce((acc, item) => acc + item.qte, 0)} articles
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Le panier est vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex flex-col p-3 bg-white border border-border rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-foreground">{item.nom}</span>
                  <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-border">
                    <button onClick={() => updateQte(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">{item.qte}</span>
                    <button onClick={() => updateQte(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-foreground">{(item.prix * item.qte).toFixed(2)} €</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white border-t border-border">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>TVA (20%)</span>
              <span>{(total * 0.2).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-foreground pt-3 border-t border-dashed border-border">
              <span>Total TTC</span>
              <span className="text-primary-600">{(total * 1.2).toFixed(2)} €</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center py-3 px-4 border border-border rounded-xl text-foreground hover:bg-gray-50 hover:border-gray-300 transition-all font-medium gap-2">
              <Banknote size={20} className="text-green-600" />
              Espèces
            </button>
            <button className="flex flex-col items-center justify-center py-3 px-4 border border-border rounded-xl text-foreground hover:bg-gray-50 hover:border-gray-300 transition-all font-medium gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Carte Bleue
            </button>
          </div>
          <button 
            disabled={cart.length === 0}
            className="w-full mt-3 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover-lift-none"
          >
            Valider l&apos;encaissement
          </button>
        </div>
      </div>
    </div>
  );
}
