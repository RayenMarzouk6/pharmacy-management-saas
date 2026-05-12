'use client';

import { FileText, Download, Eye, Calendar } from 'lucide-react';

export default function VentesPage() {
  const mockVentes = [
    { id: 'FAC-2026-001', date: '02 Mai 2026 14:30', pharmacien: 'Dr. Dupont', total: 45.50, statut: 'Payée', methode: 'Carte Bleue' },
    { id: 'FAC-2026-002', date: '02 Mai 2026 15:15', pharmacien: 'Dr. Dupont', total: 12.00, statut: 'Payée', methode: 'Espèces' },
    { id: 'FAC-2026-003', date: '02 Mai 2026 16:45', pharmacien: 'Dr. Martin', total: 89.90, statut: 'Payée', methode: 'Carte Bleue' },
    { id: 'FAC-2026-004', date: '01 Mai 2026 09:20', pharmacien: 'Dr. Martin', total: 150.00, statut: 'Annulée', methode: '-' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historique des Ventes</h1>
          <p className="text-gray-500 mt-1">Consultez les factures et les encaissements réalisés.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-border text-foreground px-4 py-2 rounded-xl transition-colors shadow-sm font-medium hover:bg-gray-50">
          <Calendar size={18} />
          Filtrer par date
        </button>
      </div>

      <div className="glass rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">N° Facture</th>
                <th className="px-6 py-4 font-semibold">Date & Heure</th>
                <th className="px-6 py-4 font-semibold">Pharmacien</th>
                <th className="px-6 py-4 font-semibold">Méthode</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockVentes.map((vente) => (
                <tr key={vente.id} className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    {vente.id}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{vente.date}</td>
                  <td className="px-6 py-4">{vente.pharmacien}</td>
                  <td className="px-6 py-4 text-gray-500">{vente.methode}</td>
                  <td className="px-6 py-4 font-bold">{vente.total.toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vente.statut === 'Payée' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {vente.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir détails">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Télécharger PDF">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-gray-500 bg-white/50">
          <span>Affichage de 1 à 4 sur 45 résultats</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded-md hover:bg-gray-50 disabled:opacity-50">Précédent</button>
            <button className="px-3 py-1 border border-border rounded-md hover:bg-gray-50 disabled:opacity-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
