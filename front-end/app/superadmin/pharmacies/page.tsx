'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Pharmacie {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  tenantId: string;
  abonnementActif: boolean;
}

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    tenantId: ''
  });

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/pharmacies');
      if (!res.ok) throw new Error("Erreur de récupération des pharmacies");
      const data = await res.json();
      setPharmacies(Array.isArray(data) ? data : data.content || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleAddPharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await apiFetch('/api/pharmacies', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nom: '', adresse: '', telephone: '', tenantId: '' });
        fetchPharmacies();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'ajout");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Pharmacies</h1>
          <p className="text-gray-500 mt-1">Plateforme Multi-Tenant (Vue Super Admin).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30"
        >
          <Plus size={20} />
          Nouvelle Pharmacie
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <Building2 size={20} className="flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4">Nom de la Pharmacie</th>
                <th scope="col" className="px-6 py-4">Tenant ID</th>
                <th scope="col" className="px-6 py-4">Téléphone</th>
                <th scope="col" className="px-6 py-4">Statut Abonnement</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">Chargement...</td>
                </tr>
              ) : pharmacies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Building2 size={48} className="mb-4 opacity-50" />
                      <p>Aucune pharmacie enregistrée.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pharmacies.map((pharma) => (
                  <tr key={pharma.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div>{pharma.nom}</div>
                        <div className="text-xs font-normal text-gray-400">{pharma.adresse}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{pharma.tenantId}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{pharma.telephone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        pharma.abonnementActif ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {pharma.abonnementActif ? 'Actif' : 'Expiré'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1"><Edit size={18} /></button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-up">
            <h2 className="text-2xl font-bold mb-6">Nouvelle Pharmacie</h2>
            <form onSubmit={handleAddPharmacy} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Nom de la pharmacie</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Ex: Pharmacie Centrale"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Tenant ID (Identifiant unique)</label>
                <input
                  type="text"
                  required
                  value={formData.tenantId}
                  onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  placeholder="Ex: pharmacie-centrale-01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Téléphone</label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="+216 ..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Adresse</label>
                <input
                  type="text"
                  required
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Adresse complète..."
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Ajout...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
