'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Essentiel';
  const cycle = searchParams.get('cycle') || 'monthly';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  // Determine amount based on plan & cycle
  let amount = 99;
  if (plan === 'Professionnel') amount = 199;
  if (plan === 'Entreprise') amount = 399;
  if (cycle === 'yearly') amount = amount * 10;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate payment processing & subscription activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would:
      // 1. Process payment via Stripe / ClicToPay
      // 2. Call backend to update subscription status
      // await apiFetch('/api/subscriptions/activate', { method: 'POST', body: JSON.stringify({ plan, cycle }) });

      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin');
      }, 3000);

    } catch (err) {
      setError('Erreur lors du traitement du paiement. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600"></div>
        <div className="glass rounded-3xl p-12 shadow-2xl relative z-10 flex flex-col items-center animate-scale-up text-center max-w-md w-full">
          <div className="w-24 h-24 bg-white text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Paiement Réussi !</h2>
          <p className="text-primary-100 text-lg mb-8">
            Votre abonnement au plan <strong>{plan}</strong> a été activé avec succès.
          </p>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-200 mt-4 text-sm">Redirection vers votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 animate-fade-in relative z-10">
        
        {/* Order Summary */}
        <div className="w-full md:w-1/3 glass rounded-3xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">Résumé de la commande</h2>
            
            <div className="bg-white/50 rounded-xl p-4 mb-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-foreground">Plan {plan}</span>
                <span className="font-bold text-primary-600">{amount} TND</span>
              </div>
              <div className="text-sm text-gray-500">
                Facturation {cycle === 'monthly' ? 'Mensuelle' : 'Annuelle'}
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sous-total</span>
                <span>{amount} TND</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>TVA (19%)</span>
                <span>{(amount * 0.19).toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border mt-2">
                <span>Total</span>
                <span>{(amount * 1.19).toFixed(2)} TND</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100">
            <ShieldCheck size={20} className="flex-shrink-0" />
            <span>Paiement 100% sécurisé et chiffré.</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="w-full md:w-2/3 glass rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <CreditCard className="text-primary-500" /> Détails de paiement
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Nom sur la carte</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Foulen Ben Foulen"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Numéro de carte</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Date d'expiration</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="block w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">CVC</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 mt-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock size={18} /> Payer {(amount * 1.19).toFixed(2)} TND
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
