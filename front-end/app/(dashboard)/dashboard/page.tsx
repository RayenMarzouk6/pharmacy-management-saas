'use client';

import { Activity, Pill, AlertTriangle, TrendingUp, Users } from 'lucide-react';

const stats = [
  { name: 'Ventes du jour', value: '1,240 €', icon: Activity, change: '+12%', color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Médicaments en stock', value: '8,540', icon: Pill, change: '-2%', color: 'text-green-600', bg: 'bg-green-100' },
  { name: 'Alertes Stock Faible', value: '12', icon: AlertTriangle, change: '+3', color: 'text-orange-600', bg: 'bg-orange-100' },
  { name: 'Nouveaux Patients', value: '45', icon: Users, change: '+5%', color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue, voici le résumé de votre pharmacie aujourd&apos;hui.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass rounded-2xl p-6 hover-lift">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold mt-4 text-foreground">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Aperçu des Ventes</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Voir tout</button>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-gray-50/50">
            <p className="text-gray-400 flex items-center gap-2">
              <TrendingUp size={20} /> Graphique des ventes (à implémenter)
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Alertes Stock</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Voir tout</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Pill size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Doliprane 1000mg</p>
                  <p className="text-xs text-gray-500">Reste 5 boîtes</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Critique
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
