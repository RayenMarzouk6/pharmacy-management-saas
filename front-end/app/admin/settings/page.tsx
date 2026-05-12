'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Building2, Shield, Bell, Lock, Save, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { apiFetch, getAuthUser } from '@/lib/api';

interface PharmacySettings {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  tenantId: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<PharmacySettings>({
    id: '',
    nom: '',
    adresse: '',
    telephone: '',
    tenantId: ''
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const user = getAuthUser();
      if (!user || !user.pharmacieId) throw new Error("Utilisateur non authentifié ou pharmacie non trouvée");
      
      const res = await apiFetch(`/api/pharmacies/${user.pharmacieId}`);
      if (!res.ok) throw new Error("Erreur de récupération des paramètres");
      
      const data = await res.json();
      setFormData(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch(`/api/pharmacies/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('Paramètres mis à jour avec succès !');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres de l'Officine</h1>
        <p className="text-gray-500 mt-1">Gérez les informations et les préférences de votre pharmacie.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-3 border border-green-100">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-1">Profil de la Pharmacie</h3>
          <p className="text-sm text-gray-500">Ces informations seront visibles sur vos factures et rapports.</p>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Nom de l'officine</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Tenant ID</label>
                  <input
                    type="text"
                    disabled
                    value={formData.tenantId}
                    className="w-full p-3 border border-border rounded-xl bg-gray-50 text-gray-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Adresse Complète</label>
                <textarea
                  required
                  rows={3}
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
              >
                <Save size={20} />
                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-1 border-t border-gray-100 pt-8">
          <h3 className="font-semibold text-gray-900 mb-1">Préférences & Sécurité</h3>
          <p className="text-sm text-gray-500">Gérez vos alertes et la sécurité de votre compte.</p>
        </div>

        <div className="md:col-span-2 space-y-4 pt-8">
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-100 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">Alertes de Stock</p>
                <p className="text-xs text-gray-500">Notifications quand un produit atteint le seuil critique.</p>
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked/>
              <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-100 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Authentification à deux facteurs</p>
                <p className="text-xs text-gray-500">Ajoutez une couche de sécurité à votre compte.</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary-600 hover:underline">Activer</button>
          </div>
        </div>

        {/* Plan Upgrade Section */}
        <div className="md:col-span-1 border-t border-gray-100 pt-8">
          <h3 className="font-semibold text-gray-900 mb-1">Abonnement</h3>
          <p className="text-sm text-gray-500">Consultez votre plan actuel et mettez-le à jour pour débloquer plus de fonctionnalités.</p>
        </div>

        <div className="md:col-span-2 pt-8">
          <Link href="/admin/abonnement" className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl text-white shadow-xl shadow-primary-100 hover:scale-[1.02] transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">Gérer mon Plan d'Abonnement</p>
                <p className="text-primary-100 text-sm opacity-80">Mise à niveau, factures et limites d'utilisation.</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <Save size={20} className="rotate-[270deg]" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
