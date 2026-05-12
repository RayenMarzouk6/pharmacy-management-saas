'use client';

import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Filter } from 'lucide-react';

export default function MedicamentsPage() {
  const [search, setSearch] = useState('');

  const mockMedicaments = [
    { id: 1, nom: 'Doliprane 1000mg', categorie: 'Antalgique', stock: 45, prix: 2.50, fournisseur: 'Sanofi' },
    { id: 2, nom: 'Amoxicilline 500mg', categorie: 'Antibiotique', stock: 120, prix: 5.20, fournisseur: 'Pfizer' },
    { id: 3, nom: 'Spasfon', categorie: 'Antispasmodique', stock: 8, prix: 3.10, fournisseur: 'Teva' },
    { id: 4, nom: 'Ibuprofène 400mg', categorie: 'Anti-inflammatoire', stock: 65, prix: 4.00, fournisseur: 'Mylan' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Médicaments</h1>
          <p className="text-gray-500 mt-1">Gérez le stock et le catalogue de votre pharmacie.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium">
          <Plus size={18} />
          Nouveau Médicament
        </button>
      </div>

      <div className="glass rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, catégorie..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
            <Filter size={16} /> Filtres
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Nom du Médicament</th>
                <th className="px-6 py-4 font-semibold">Catégorie</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Prix Unitaire</th>
                <th className="px-6 py-4 font-semibold">Fournisseur</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockMedicaments.map((med) => (
                <tr key={med.id} className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{med.nom}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {med.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${med.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className={med.stock < 10 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                        {med.stock} unités
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{med.prix.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-gray-500">{med.fournisseur}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-gray-500 bg-white/50">
          <span>Affichage de 1 à 4 sur 4 résultats</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded-md hover:bg-gray-50 disabled:opacity-50">Précédent</button>
            <button className="px-3 py-1 border border-border rounded-md hover:bg-gray-50 disabled:opacity-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
