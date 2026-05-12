'use client';

import { Building2, Plus, Users, CreditCard } from 'lucide-react';

export default function PharmaciesPage() {
  const mockPharmacies = [
    { id: 1, nom: 'Pharmacie Centrale', ville: 'Paris', plan: 'Premium SaaS', employes: 4, statut: 'Actif' },
    { id: 2, nom: 'Pharmacie de la Gare', ville: 'Lyon', plan: 'Standard SaaS', employes: 2, statut: 'Actif' },
    { id: 3, nom: 'Pharmacie du Marché', ville: 'Marseille', plan: 'Basic SaaS', employes: 1, statut: 'Expiré' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="text-primary-600" />
            Pharmacies (Super Admin)
          </h1>
          <p className="text-gray-500 mt-1">Gérez les abonnements et les tenants SaaS.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium">
          <Plus size={18} />
          Nouvelle Pharmacie
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPharmacies.map((pharmacie) => (
          <div key={pharmacie.id} className="glass rounded-2xl p-6 hover-lift border-t-4 border-t-primary-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-foreground">{pharmacie.nom}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pharmacie.statut === 'Actif' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {pharmacie.statut}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6">{pharmacie.ville}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600"><CreditCard size={16}/> Plan</span>
                <span className="font-semibold">{pharmacie.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600"><Users size={16}/> Employés</span>
                <span className="font-semibold">{pharmacie.employes}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex gap-2">
              <button className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors border border-border text-gray-700">
                Détails
              </button>
              <button className="flex-1 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors border border-primary-200 text-primary-700">
                Gérer Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
