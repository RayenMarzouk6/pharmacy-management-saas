'use client';

import { Plus, User, Mail, ShieldAlert } from 'lucide-react';

export default function PharmaciensPage() {
  const mockPharmaciens = [
    { id: 1, nom: 'Dr. Jean Dupont', role: 'Admin Pharmacie', email: 'j.dupont@pharmacie.fr', status: 'Actif' },
    { id: 2, nom: 'Dr. Marie Curie', role: 'Pharmacien', email: 'm.curie@pharmacie.fr', status: 'Actif' },
    { id: 3, nom: 'Dr. Luc Blanc', role: 'Pharmacien', email: 'l.blanc@pharmacie.fr', status: 'Inactif' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Équipe & Pharmaciens</h1>
          <p className="text-gray-500 mt-1">Gérez les accès et les rôles de votre personnel.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium">
          <Plus size={18} />
          Ajouter un collaborateur
        </button>
      </div>

      <div className="glass rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Employé</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPharmaciens.map((pharmacien) => (
                <tr key={pharmacien.id} className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <span className="font-semibold text-foreground">{pharmacien.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {pharmacien.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pharmacien.role === 'Admin Pharmacie' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {pharmacien.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 ${pharmacien.status === 'Actif' ? 'text-green-600' : 'text-red-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${pharmacien.status === 'Actif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {pharmacien.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
