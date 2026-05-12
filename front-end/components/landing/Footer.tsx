'use client';

import { Pill } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <Pill size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">PharmaSaaS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              La solution complète de gestion pour les pharmacies en Tunisie. Fiable, rapide et sécurisée.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-primary-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Produit</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Tarifs</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Mises à jour</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Sécurité</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Centre d&apos;aide</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Contactez-nous</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">État du service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Légal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Conditions Générales</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Confidentialité</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Mentions légales</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PharmaSaaS. Fièrement développé en Tunisie 🇹🇳.
          </p>
        </div>
      </div>
    </footer>
  );
}
