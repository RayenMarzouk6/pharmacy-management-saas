'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Fournisseur {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: ''
  });

  const fetchFournisseurs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/fournisseurs');
      if (!res.ok) throw new Error("Erreur de récupération des fournisseurs");
      const data = await res.json();
      setFournisseurs(Array.isArray(data) ? data : data.content || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleAddFournisseur = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await apiFetch('/api/fournisseurs', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nom: '', telephone: '', email: '', adresse: '' });
        fetchFournisseurs();
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
          <h1 className="text-2xl font-bold text-foreground">Fournisseurs</h1>
          <p className="text-gray-500 mt-1">Gérez vos contacts et laboratoires.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau fournisseur
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <Truck size={20} className="flex-shrink-0" />
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
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4">Fournisseur</th>
                <th scope="col" className="px-6 py-4">Téléphone</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Adresse</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">Chargement...</td>
                </tr>
              ) : fournisseurs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Truck size={48} className="mb-4 opacity-50" />
                      <p>Aucun fournisseur trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                fournisseurs.map((f) => (
                  <tr key={f.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        {f.nom.charAt(0)}
                      </div>
                      {f.nom}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{f.telephone}</td>
                    <td className="px-6 py-4 text-blue-600">{f.email}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{f.adresse}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-gray-400 hover:text-primary-600 transition-colors p-1"><Edit size={18} /></button>
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
            <h2 className="text-2xl font-bold mb-6">Ajouter un fournisseur</h2>
            <form onSubmit={handleAddFournisseur} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Nom du laboratoire/fournisseur</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Ex: Sanofi, Pfizer..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Téléphone</label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="+216 ..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="contact@fournisseur.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Adresse</label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all min-h-[100px]"
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
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
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
