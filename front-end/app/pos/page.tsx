'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Receipt, Plus, Trash2, Printer } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Medicament {
  id: string;
  nom: string;
  prix: number;
  quantiteStock: number;
}

interface CartItem extends Medicament {
  quantite: number;
}

export default function POSPage() {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const res = await apiFetch('/api/medicaments');
        if (!res.ok) throw new Error("Erreur");
        const data = await res.json();
        setMedicaments(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicaments();
  }, []);

  const filteredMedicaments = medicaments.filter(m => m.nom.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (med: Medicament) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if (existing.quantite >= med.quantiteStock) return prev;
        return prev.map(item => item.id === med.id ? { ...item, quantite: item.quantite + 1 } : item);
      }
      return [...prev, { ...med, quantite: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  const downloadInvoice = async (venteId: string) => {
    try {
      console.log('Téléchargement facture pour vente:', venteId);
      const res = await apiFetch(`/api/ventes/${venteId}/facture`);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Pas de détails');
        console.error('Erreur API Facture:', res.status, errorText);
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Facture_${venteId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Erreur facture:", err);
      alert(`Vente réussie, mais échec du téléchargement de la facture: ${err.message}`);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setError('');

    try {
      const payload = {
        lignes: cart.map(item => ({
          medicamentId: item.id,
          quantite: item.quantite
        }))
      };

      const res = await apiFetch('/api/ventes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.text().catch(() => 'No details');
        throw new Error(`Erreur lors de la vente (${res.status}): ${errorData}`);
      }

      const vente = await res.json();
      setCart([]);
      
      // Auto download invoice
      await downloadInvoice(vente.id);
      
      alert("Vente enregistrée avec succès !");
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
      
      {/* Left side: Products */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Caisse Rapide</h1>
            <p className="text-gray-500 text-sm mt-1">Sélectionnez les produits pour la vente.</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un médicament (F2)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-400">Chargement du catalogue...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMedicaments.map(med => (
                <button
                  key={med.id}
                  onClick={() => addToCart(med)}
                  disabled={med.quantiteStock === 0}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-bold text-gray-900 truncate mb-1">{med.nom}</div>
                  <div className="text-xl font-extrabold text-primary-600 mb-2">{med.prix} TND</div>
                  <div className="text-xs text-gray-400 font-medium bg-gray-50 inline-block px-2 py-1 rounded">
                    Stock: <span className={med.quantiteStock === 0 ? 'text-red-500' : 'text-green-500'}>{med.quantiteStock}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Cart */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-100 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Panier actuel</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="text-sm">Le panier est vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{item.nom}</h4>
                  <p className="text-xs text-gray-500">{item.prix} TND x {item.quantite}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary-600">{(item.prix * item.quantite).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Total TTC</span>
            <span className="text-4xl font-extrabold text-gray-900">{total.toFixed(2)} <span className="text-xl text-gray-500">TND</span></span>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? 'Enregistrement...' : (
              <>
                <Receipt size={20} />
                Encaisser & Facturer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
