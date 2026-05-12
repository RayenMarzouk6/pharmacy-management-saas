'use client';

import { Settings, Shield, Bell, Lock, Globe, Database } from 'lucide-react';

export default function SuperAdminSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres Système</h1>
        <p className="text-gray-500 mt-1">Configurez les options globales de la plateforme PharmaSaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-gray-900">Général</h3>
          <p className="text-sm text-gray-500">Informations de base et préférences globales.</p>
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-semibold">Nom de la Plateforme</p>
                  <p className="text-xs text-gray-500">PharmaSaaS Tunisia</p>
                </div>
              </div>
              <button className="text-xs font-bold text-primary-600">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
               <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-semibold">Notifications Système</p>
                  <p className="text-xs text-gray-500">Gérer les alertes administratives</p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-gray-900">Sécurité & Maintenance</h3>
          <p className="text-sm text-gray-500">Contrôle des accès et sauvegardes.</p>
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-semibold">Politique de Mots de Passe</p>
                  <p className="text-xs text-gray-500">Exigences minimales de sécurité</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:border-red-200 transition-colors cursor-pointer">
               <div className="flex items-center gap-3">
                <Database size={20} className="text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Sauvegarde Base de Données</p>
                  <p className="text-xs text-red-600">Lancer une sauvegarde manuelle maintenant</p>
                </div>
              </div>
              <button className="text-xs font-bold text-red-600">Lancer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
