'use client';

import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function FailedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-fade-in">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <XCircle size={48} strokeWidth={3} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900">Paiement échoué</h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Désolé, la transaction n'a pas pu être finalisée. Votre compte n'a pas été débité.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl text-left space-y-2 border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Raisons possibles :</p>
            <ul className="text-sm text-gray-600 space-y-1 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                Solde insuffisant sur votre compte Flouci
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                Transaction annulée par l'utilisateur
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                Délai d'attente de session expiré
              </li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link 
              href="/admin/abonnement"
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Réessayer le paiement
            </Link>
            
            <Link 
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
