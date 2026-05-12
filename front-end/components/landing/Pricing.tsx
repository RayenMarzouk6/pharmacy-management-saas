'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';

const plans = [
  {
    name: "Basic",
    price: "49",
    description: "Parfait pour les petites pharmacies indépendantes.",
    features: [
      "1 Utilisateur (Admin)",
      "Gestion des ventes basique",
      "Catalogue jusqu'à 5000 produits",
      "Support par email"
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "99",
    description: "Idéal pour une pharmacie active avec plusieurs employés.",
    features: [
      "Jusqu'à 5 Utilisateurs",
      "Gestion avancée des stocks & alertes",
      "Catalogue de produits illimité",
      "Gestion des fournisseurs",
      "Support prioritaire 7/7"
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "149",
    description: "Pour les groupements de pharmacies ou grandes officines.",
    features: [
      "Utilisateurs illimités",
      "Multi-Pharmacies (Plusieurs points de vente)",
      "Statistiques et prévisions avancées",
      "API pour intégrations tierces",
      "Gestionnaire de compte dédié"
    ],
    highlighted: false,
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">Tarification transparente</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des plans adaptés à chaque pharmacie
          </h3>
          <p className="text-lg text-gray-600">
            Payez en Dinar Tunisien (TND). Aucun frais caché. Annulable à tout moment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border ${
                plan.highlighted 
                  ? 'border-primary-500 shadow-2xl scale-105 z-10' 
                  : 'border-gray-200 shadow-sm'
              } flex flex-col`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <p className="text-gray-500 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-xl font-semibold text-gray-500"> TND</span>
                <span className="text-gray-500"> / mois</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`flex-shrink-0 ${plan.highlighted ? 'text-primary-500' : 'text-green-500'}`} size={20} />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.highlighted
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
              }`}>
                Choisir ce plan
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider font-semibold">Moyens de paiement acceptés en Tunisie</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
              💳 Carte Bancaire
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-blue-800">
              📱 Flouci / D17
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-yellow-600">
              📮 E-Dinar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
