'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Users, 
  ShoppingCart,
  Calendar,
  Clock
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface DashboardStats {
  caJour: number;
  caSemaine: number;
  caMois: number;
  stockFaible: any[];
  topMedicaments: any[];
  ventesByPharmacien: any[];
}

export default function PharmacienDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch('/api/pharmacien/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement de votre tableau de bord...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de Bord Pharmacien</h1>
          <p className="text-gray-500 mt-1">Vos performances et alertes stocks du jour.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-600">
          <Calendar size={16} />
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">C.A. Aujourd'hui</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.caJour?.toFixed(2) || 0} TND</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
             <TrendingUp size={12} className="mr-1" />
             Ventes en cours
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">C.A. Semaine</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.caSemaine?.toFixed(2) || 0} TND</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-400">
             Vue hebdomadaire
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Alertes Stock</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.stockFaible?.length || 0}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-amber-600 font-medium">
             Produits à commander
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Package size={20} className="text-amber-500" />
              Stocks Faibles
            </h2>
            <button className="text-sm text-primary hover:underline font-medium">Tout voir</button>
          </div>
          <div className="p-6">
            {stats?.stockFaible && stats.stockFaible.length > 0 ? (
              <div className="space-y-4">
                {stats.stockFaible.slice(0, 4).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-sm">{item.nom}</p>
                      <p className="text-xs text-gray-500">{item.forme}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{item.quantiteStock} restants</p>
                      <p className="text-xs text-gray-400">Seuil: {item.seuilAlerte}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package size={40} className="mx-auto mb-2 opacity-20" />
                Aucun produit en rupture
              </div>
            )}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users size={20} className="text-indigo-500" />
              Top Médicaments
            </h2>
          </div>
          <div className="p-6">
             {stats?.topMedicaments && stats.topMedicaments.length > 0 ? (
                <div className="space-y-4">
                  {stats.topMedicaments.slice(0, 4).map((med: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{med.nom}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div className="text-right font-medium text-sm">
                        {med.quantiteVendue} unités
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="text-center py-8 text-gray-400">
                  <TrendingUp size={40} className="mx-auto mb-2 opacity-20" />
                  Données de vente indisponibles
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
