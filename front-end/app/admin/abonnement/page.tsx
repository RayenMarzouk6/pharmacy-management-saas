'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Shield, Crown, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch, listPlans, API_ENDPOINT } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

interface Plan {
  id: string;
  nom: string;
  prixMensuel: number;
  maxUtilisateurs: number;
  features: string[];
}

export default function AbonnementPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('STARTER');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const plansData = await listPlans();
      setPlans(plansData);

      if (user?.pharmacieId) {
        const pharRes = await apiFetch(`${API_ENDPOINT}/pharmacies/${user.pharmacieId}`);
        const pharData = await pharRes.json();
        // Assuming the backend returns plan object or planNom
        setCurrentPlan(pharData.abonnement?.plan?.nom || 'STARTER');
      }
    } catch (err: any) {
      setError("Erreur lors du chargement des plans d'abonnement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpgrade = async (planId: string) => {
    if (!user?.pharmacieId) {
      alert("Erreur: ID de pharmacie introuvable");
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Use apiFetch directly to inspect the HTTP status before parsing
      const response = await apiFetch(`${API_ENDPOINT}/payments/flouci/plans/${planId}`, {
        method: 'POST',
      });

      const res = await response.json();

      if (!response.ok) {
        // Backend returned an error (4xx/5xx)
        throw new Error(res.message || `Erreur serveur (${response.status})`);
      }

      if (res.paymentUrl) {
        // Redirect to Flouci payment page
        window.location.href = res.paymentUrl;
      } else {
        throw new Error("Le serveur n'a pas retourné de lien de paiement. Vérifiez la configuration Flouci.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'initiation du paiement");
      console.error('Payment initiation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Chargement des offres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Abonnement & Plan</h1>
        <p className="text-gray-500 text-lg">Gérez votre licence PharmaSaaS et débloquez de nouvelles fonctionnalités pour votre officine.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100 max-w-2xl">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = currentPlan?.toUpperCase() === plan.nom.toUpperCase();
          const isPremium = plan.nom.toUpperCase() === 'PREMIUM';
          const isEnterprise = plan.nom.toUpperCase() === 'ENTERPRISE';

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-[2.5rem] p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${isCurrent ? 'ring-4 ring-primary-500 ring-offset-4' : 'border border-gray-100'
                } ${isPremium ? 'scale-105 z-10 shadow-primary-100' : ''}`}
            >
              {isPremium && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg uppercase tracking-widest">
                  Plus populaire
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold border border-primary-100">
                  <Check size={12} /> Plan actuel
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${isEnterprise ? 'bg-indigo-50 text-indigo-600' :
                    isPremium ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                  {isEnterprise ? <Crown size={30} /> : isPremium ? <Zap size={30} /> : <Shield size={30} />}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.nom}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-gray-900">{plan.prixMensuel}</span>
                  <span className="text-gray-400 font-bold text-lg">TND/mois</span>
                </div>
                <p className="text-gray-400 text-xs font-medium mt-1">Jusqu'à {plan.maxUtilisateurs} utilisateurs</p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">
                  Inclus dans le pack
                </div>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center transition-colors group-hover:bg-primary-600 group-hover:text-white">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-gray-600 text-sm font-medium leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                    : isPremium
                      ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:shadow-primary-200 hover:brightness-110'
                      : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
                  }`}
              >
                {isCurrent ? 'Votre plan actuel' : isPremium ? 'Passer au Premium' : 'Choisir ce plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Corporate/Custom Banner */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl mt-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black">Réseau de pharmacies ?</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Nous proposons des solutions personnalisées pour les groupements d'officines avec une gestion centralisée et des tarifs dégressifs.
            </p>
          </div>
          <button className="whitespace-nowrap bg-white text-gray-900 px-10 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">
            Demander un devis
          </button>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
