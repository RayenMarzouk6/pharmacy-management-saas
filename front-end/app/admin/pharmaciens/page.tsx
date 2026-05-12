'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, Mail, Award, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Pharmacien {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  matricule: string;
  specialite: string;
}

export default function AdminPharmaciensPage() {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PHARMACIEN',
    matricule: '',
    specialite: 'Général'
  });

  const fetchPharmaciens = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/pharmaciens');
      if (!res.ok) throw new Error("Erreur de récupération des pharmaciens");
      const data = await res.json();
      setPharmaciens(Array.isArray(data) ? data : data.content || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmaciens();
  }, []);

  const handleAddPharmacien = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await apiFetch('/api/pharmaciens', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'PHARMACIEN',
          matricule: '',
          specialite: 'Général'
        });
        fetchPharmaciens();
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
          <h1 className="text-2xl font-bold text-foreground">Gestion de l'Équipe</h1>
          <p className="text-gray-500 mt-1">Gérez les pharmaciens et le personnel de votre officine.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} />
          Ajouter un membre
        </button>
      </div>

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
                <th scope="col" className="px-6 py-4">Utilisateur</th>
                <th scope="col" className="px-6 py-4">Matricule</th>
                <th scope="col" className="px-6 py-4">Spécialité</th>
                <th scope="col" className="px-6 py-4">Rôle</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">Chargement...</td>
                </tr>
              ) : pharmaciens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users size={48} className="mb-4 opacity-50" />
                      <p>Aucun membre d'équipe trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pharmaciens.map((p) => (
                  <tr key={p.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                        {p.first_name.charAt(0)}{p.last_name.charAt(0)}
                      </div>
                      <div>
                        <p>{p.first_name} {p.last_name}</p>
                        <p className="text-xs text-gray-400 font-normal">{p.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{p.matricule || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{p.specialite}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {p.role}
                      </span>
                    </td>
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
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-scale-up">
            <h2 className="text-2xl font-bold mb-6">Ajouter un membre</h2>
            <form onSubmit={handleAddPharmacien} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nom"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Email Professionnel</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-3 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="email@pharmacie.com"
                    />
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Mot de passe provisoire</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Matricule</label>
                  <input
                    type="text"
                    required
                    value={formData.matricule}
                    onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: PH-2024-001"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Spécialité</label>
                  <select
                    value={formData.specialite}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="Général">Général</option>
                    <option value="Biologie">Biologie</option>
                    <option value="Hospitalier">Hospitalier</option>
                    <option value="Officine">Officine</option>
                  </select>
                </div>
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
                  {isSubmitting ? 'Ajout...' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
