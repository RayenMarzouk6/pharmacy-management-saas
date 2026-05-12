'use client';

import { Plus, Search, Mail, Phone, ExternalLink } from 'lucide-react';

export default function FournisseursPage() {
  const mockFournisseurs = [
    { id: 1, nom: 'Sanofi Aventis', contact: 'Jean Martin', email: 'contact@sanofi.fr', tel: '01 40 50 60 70', commandesEnCours: 2 },
    { id: 2, nom: 'Pfizer France', contact: 'Marie Curie', email: 'commandes@pfizer.fr', tel: '01 22 33 44 55', commandesEnCours: 0 },
    { id: 3, nom: 'Teva Santé', contact: 'Luc Blanc', email: 'pro@teva.fr', tel: '04 50 60 70 80', commandesEnCours: 5 },
    { id: 4, nom: 'Mylan Viatris', contact: 'Sophie Dubois', email: 'contact@mylan.fr', tel: '01 80 90 00 11', commandesEnCours: 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fournisseurs</h1>
          <p className="text-gray-500 mt-1">Gérez vos laboratoires et fournisseurs de médicaments.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium">
          <Plus size={18} />
          Nouveau Fournisseur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFournisseurs.map((fournisseur) => (
          <div key={fournisseur.id} className="glass rounded-2xl p-6 hover-lift flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                {fournisseur.nom.charAt(0)}
              </div>
              {fournisseur.commandesEnCours > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  {fournisseur.commandesEnCours} commande(s)
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-1">{fournisseur.nom}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">Contact: {fournisseur.contact}</p>
            
            <div className="space-y-2 mt-auto">
              <a href={`mailto:${fournisseur.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                <Mail size={16} /> {fournisseur.email}
              </a>
              <a href={`tel:${fournisseur.tel}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                <Phone size={16} /> {fournisseur.tel}
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                Commander <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
