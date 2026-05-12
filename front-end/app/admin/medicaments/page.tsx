'use client';

import { useState, useEffect } from 'react';
import { Pill, Plus, Search, AlertCircle, Edit, Trash2, X, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Medicament {
  id: string;
  nom: string;
  description: string;
  prix: number;
  quantiteStock: number;
  seuilAlerte: number;
  dateExpiration: string;
  imageUrl?: string;
  codeBarres?: string;
  fournisseur?: {
    id: string;
    nom: string;
  };
}

interface Fournisseur {
  id: string;
  nom: string;
}

const INITIAL_FORM_DATA = {
  nom: '',
  description: '',
  prix: 0,
  quantiteStock: 0,
  seuilAlerte: 5,
  dateExpiration: '',
  imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
  codeBarres: '',
  fournisseurId: ''
};

export default function MedicamentsPage() {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

  // Edit mode state
  const [editingMedicament, setEditingMedicament] = useState<Medicament | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Medicament | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const fetchMedicaments = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/medicaments');
      if (!res.ok) throw new Error("Erreur de récupération des médicaments");
      const data = await res.json();
      setMedicaments(Array.isArray(data) ? data : data.content || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const res = await apiFetch('/api/fournisseurs');
      if (!res.ok) throw new Error("Erreur de récupération des fournisseurs");
      const data = await res.json();
      setFournisseurs(Array.isArray(data) ? data : data.content || []);
    } catch (err: unknown) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchMedicaments();
    fetchFournisseurs();
  }, []);

  // Auto-dismiss success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const openAddModal = () => {
    setEditingMedicament(null);
    setFormData(INITIAL_FORM_DATA);
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (med: Medicament) => {
    setEditingMedicament(med);
    setFormData({
      nom: med.nom,
      description: med.description || '',
      prix: med.prix,
      quantiteStock: med.quantiteStock,
      seuilAlerte: med.seuilAlerte,
      dateExpiration: med.dateExpiration ? med.dateExpiration.split('T')[0] : '',
      imageUrl: med.imageUrl || '',
      codeBarres: med.codeBarres || '',
      fournisseurId: med.fournisseur?.id || ''
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicament(null);
    setFormData(INITIAL_FORM_DATA);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const isEditing = !!editingMedicament;
      const url = isEditing
        ? `/api/medicaments/${editingMedicament!.id}`
        : '/api/medicaments';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        closeModal();
        fetchMedicaments();
        setSuccessMessage(
          isEditing
            ? `"${formData.nom}" a été mis à jour avec succès.`
            : `"${formData.nom}" a été ajouté avec succès.`
        );
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || (isEditing ? "Erreur lors de la mise à jour" : "Erreur lors de l'ajout"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError('');

    try {
      const res = await apiFetch(`/api/medicaments/${deleteTarget.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setDeleteTarget(null);
        fetchMedicaments();
        setSuccessMessage(`"${deleteTarget.nom}" a été supprimé avec succès.`);
      } else {
        let errorMsg = "Erreur lors de la suppression";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // response may not be JSON
        }
        throw new Error(errorMsg);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Médicaments</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue et votre stock.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau médicament
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200 animate-fade-in">
          <CheckCircle size={20} />
          <p className="text-sm font-medium">{successMessage}</p>
          <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-400 hover:text-green-600 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
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
                <th scope="col" className="px-6 py-4">Nom</th>
                <th scope="col" className="px-6 py-4">Stock</th>
                <th scope="col" className="px-6 py-4">Prix Vente</th>
                <th scope="col" className="px-6 py-4">Expiration</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">Chargement...</td>
                </tr>
              ) : medicaments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Pill size={48} className="mb-4 opacity-50" />
                      <p>Aucun médicament trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                medicaments.map((med) => (
                  <tr key={med.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 overflow-hidden">
                        <img 
                          src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop'} 
                          alt={med.nom}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p>{med.nom}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400 font-normal">{med.codeBarres}</p>
                          {med.fournisseur && (
                            <>
                              <span className="text-gray-300">•</span>
                              <p className="text-xs text-primary-600 font-medium">{med.fournisseur.nom}</p>
                            </>
                          )}
                        </div>
                      </div>

                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        med.quantiteStock < med.seuilAlerte ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {med.quantiteStock} unités
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {med.prix} TND
                    </td>
                    <td className="px-6 py-4">
                      {new Date(med.dateExpiration).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(med)}
                        title="Modifier"
                        className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(med)}
                        title="Supprimer"
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      >
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingMedicament ? 'Modifier le médicament' : 'Ajouter un médicament'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Prix (TND)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Stock {editingMedicament ? 'Actuel' : 'Initial'}</label>
                  <input
                    type="number"
                    required
                    value={formData.quantiteStock}
                    onChange={(e) => setFormData({...formData, quantiteStock: parseInt(e.target.value)})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Seuil Alerte</label>
                  <input
                    type="number"
                    required
                    value={formData.seuilAlerte}
                    onChange={(e) => setFormData({...formData, seuilAlerte: parseInt(e.target.value)})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Expiration</label>
                  <input
                    type="date"
                    required
                    value={formData.dateExpiration}
                    onChange={(e) => setFormData({...formData, dateExpiration: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold">Code barres</label>
                  <input
                    type="text"
                    value={formData.codeBarres}
                    onChange={(e) => setFormData({...formData, codeBarres: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="EAN-13, UPC, etc."
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold">Fournisseur</label>
                  <select
                    required
                    value={formData.fournisseurId}
                    onChange={(e) => setFormData({...formData, fournisseurId: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Sélectionnez un fournisseur</option>
                    {fournisseurs.map(f => (
                      <option key={f.id} value={f.id}>{f.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                    placeholder="Description du médicament..."
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold">URL de l&apos;image</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://..."
                  />
                </div>

              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? (editingMedicament ? 'Mise à jour...' : 'Ajout...')
                    : (editingMedicament ? 'Mettre à jour' : 'Confirmer')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmer la suppression</h2>
              <p className="text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-700">&quot;{deleteTarget.nom}&quot;</span> ?
                <br />
                <span className="text-sm text-red-500">Cette action est irréversible.</span>
              </p>
              <div className="flex gap-4 w-full">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
