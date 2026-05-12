'use client';

import { useState, useEffect } from 'react';
import { Receipt, Search, Download, Calendar, Eye, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Vente {
  id: string;
  montantTotal: number;
  dateVente: string;
  utilisateurNom?: string;
  statut?: string;
  lignes?: any[];
}

export default function VentesPage() {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVente, setSelectedVente] = useState<Vente | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchVentes = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/ventes');
      if (!res.ok) throw new Error("Erreur de récupération des ventes");
      const data = await res.json();
      setVentes(Array.isArray(data) ? data : data.content || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  const handleDownloadInvoice = async (id: string) => {
    try {
      console.log('Téléchargement facture:', id);
      const res = await apiFetch(`/api/ventes/${id}/facture`);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Pas de détails');
        console.error('Erreur facture API:', res.status, errorText);
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Facture_${id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Erreur téléchargement:", err);
      alert(`Erreur lors du téléchargement de la facture: ${err.message}`);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const res = await apiFetch(`/api/ventes/${id}`);
      if (!res.ok) throw new Error("Impossible de charger les détails");
      const data = await res.json();
      setSelectedVente(data);
      setShowDetails(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVente = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vente ? Cette action est irréversible.")) return;
    try {
      const res = await apiFetch(`/api/ventes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setVentes(ventes.filter(v => v.id !== id));
      alert("Vente supprimée avec succès");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatut: string) => {
    try {
      const res = await apiFetch(`/api/ventes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ statut: newStatut })
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      fetchVentes();
      if (selectedVente?.id === id) {
        const updated = await res.json();
        setSelectedVente(updated);
      }
      alert("Statut mis à jour");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historique des Ventes</h1>
          <p className="text-gray-500 mt-1">Gérez vos transactions et factures.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par ID..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4">N° Facture</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Chargement...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center py-8 text-red-500">{error}</td></tr>
              ) : ventes.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucune vente.</td></tr>
              ) : (
                ventes.map((vente) => (
                  <tr key={vente.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      #FCT-{vente.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {vente.dateVente ? new Date(vente.dateVente).toLocaleString() : 'En attente'}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary-600">
                      {(vente.montantTotal || 0).toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vente.statut === 'VALIDEE' ? 'bg-green-100 text-green-700' : 
                        vente.statut === 'ANNULEE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {vente.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleViewDetails(vente.id)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Détails">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDownloadInvoice(vente.id)} className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors" title="PDF">
                        <Download size={18} />
                      </button>
                      <button onClick={() => handleDeleteVente(vente.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetails && selectedVente && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Détails de la Vente #{selectedVente.id.substring(0, 8)}</h2>
                <p className="text-sm text-gray-500">{selectedVente.dateVente ? new Date(selectedVente.dateVente).toLocaleString() : ''}</p>
              </div>
              <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Statut Actuel</p>
                  <p className="font-bold text-primary-700">{selectedVente.statut}</p>
                </div>
                <div className="flex gap-2">
                  {selectedVente.statut !== 'VALIDEE' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedVente.id, 'VALIDEE')}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-700"
                    >
                      <CheckCircle size={16} /> Valider
                    </button>
                  )}
                  {selectedVente.statut !== 'ANNULEE' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedVente.id, 'ANNULEE')}
                      className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm font-bold hover:bg-red-200"
                    >
                      <AlertCircle size={16} /> Annuler
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold mb-3">Articles</h3>
              <div className="space-y-3">
                {selectedVente.lignes?.map((ligne: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{ligne.medicamentNom || `Médicament ID: ${ligne.medicamentId.substring(0,8)}`}</p>
                      <p className="text-xs text-gray-500">{ligne.prixUnitaire} TND x {ligne.quantite}</p>
                    </div>
                    <p className="font-bold text-primary-600">{(ligne.prixUnitaire * ligne.quantite).toFixed(2)} TND</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-b-3xl">
              <span className="text-gray-500 font-bold">MONTANT TOTAL</span>
              <span className="text-2xl font-black text-gray-900">{selectedVente.montantTotal?.toFixed(2)} TND</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

