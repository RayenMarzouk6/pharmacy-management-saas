'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, CreditCard, Layout, Activity, TrendingUp } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface SuperAdminStats {
  totalPharmacies: number;
  activeSubscriptions: number;
  totalPlans: number;
  totalUsers: number;
  totalSuperAdmins: number;
  totalAdmins: number;
  totalPharmaciens: number;
  systemSalesCount: number;
  systemSalesAmount: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/api/superadmin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          throw new Error("Impossible de charger les statistiques");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement des données plateforme...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Console Super Admin</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme PharmaSaaS.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pharmacies Total</p>
              <h3 className="text-2xl font-bold">{stats?.totalPharmacies || 0}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600 font-semibold">{stats?.activeSubscriptions || 0}</span>
            <span className="text-gray-400">abonnements actifs</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chiffre d'Affaires Global</p>
              <h3 className="text-2xl font-bold">{stats?.systemSalesAmount?.toFixed(2) || 0} TND</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-semibold">{stats?.systemSalesCount || 0}</span>
            <span className="text-gray-400">ventes totales</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Utilisateurs Plateforme</p>
              <h3 className="text-2xl font-bold">{stats?.totalUsers || 0}</h3>
            </div>
          </div>
          <div className="text-xs text-gray-400 grid grid-cols-2 gap-2 mt-2">
            <span>{stats?.totalAdmins || 0} Admins</span>
            <span>{stats?.totalPharmaciens || 0} Pharmaciens</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Layout size={20} className="text-gray-400" />
            Configuration Système
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-gray-400" />
                <span className="text-sm font-medium">Plans Tarifaires</span>
              </div>
              <span className="bg-white px-3 py-1 rounded-lg border text-sm font-bold">{stats?.totalPlans || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-gray-400" />
                <span className="text-sm font-medium">Santé du Système</span>
              </div>
              <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Opérationnel</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users size={20} className="text-gray-400" />
            Répartition des Rôles
          </h2>
          <div className="space-y-3">
             <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: stats?.totalUsers ? `${((stats.totalAdmins + stats.totalSuperAdmins) / stats.totalUsers) * 100}%` : '0%' }}></div>
             </div>
             <div className="flex justify-between text-xs text-gray-500">
                <span>Admins & SuperAdmins</span>
                <span>Pharmaciens</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
