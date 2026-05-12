'use client';

import { useEffect, useState } from 'react';
import { Activity, Pill, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { apiFetch } from '@/lib/api';

export default function AdminDashboard() {
  const { subscription } = useAuth();
  const [stats, setStats] = useState({
    caJour: 0,
    caSemaine: 0,
    caMois: 0,
    alertesStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch('/api/pharmacien/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats({
            caJour: data.caJour || 0,
            caSemaine: data.caSemaine || 0,
            caMois: data.caMois || 0,
            alertesStock: data.stockFaible?.length || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Free Trial Banner */}
      {subscription?.status === 'TRIAL' && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold">Période d'essai gratuit</p>
              <p className="text-sm text-orange-100">Il vous reste {subscription.trialDaysLeft} jours. Ajoutez un moyen de paiement pour ne pas être interrompu.</p>
            </div>
          </div>
          <button className="bg-white text-orange-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors">
            Mettre à niveau
          </button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord - Pharmacie</h1>
        <p className="text-gray-500 mt-1">Gérez votre officine et vos équipes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="text-green-600 text-sm font-semibold">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : `${stats.caJour.toFixed(2)} TND`}</h3>
          <p className="text-sm text-gray-500">Chiffre d'Affaires (Jour)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : `${stats.caSemaine.toFixed(2)} TND`}</h3>
          <p className="text-sm text-gray-500">Chiffre d'Affaires (Semaine)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : `${stats.caMois.toFixed(2)} TND`}</h3>
          <p className="text-sm text-gray-500">Chiffre d'Affaires (Mois)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.alertesStock}</h3>
          <p className="text-sm text-gray-500">Alertes stock faible</p>
        </div>
      </div>
    </div>
  );
}
