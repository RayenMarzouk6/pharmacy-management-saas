'use client';

import { motion } from 'framer-motion';
import { Pill, TrendingUp, AlertTriangle, Truck, Clock } from 'lucide-react';

const features = [
  {
    icon: Pill,
    title: "Gestion des médicaments",
    description: "Catalogue complet avec recherche rapide, classification et suivi par lot.",
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    icon: TrendingUp,
    title: "Ventes & Facturation",
    description: "Système de caisse ultra-rapide optimisé pour les pics d'affluence en pharmacie.",
    color: "bg-green-50 text-green-600 border-green-100"
  },
  {
    icon: Clock,
    title: "Suivi du stock en temps réel",
    description: "Mise à jour automatique du stock après chaque vente effectuée.",
    color: "bg-purple-50 text-purple-600 border-purple-100"
  },
  {
    icon: AlertTriangle,
    title: "Alertes Intelligentes",
    description: "Notifications automatiques pour les stocks faibles et dates d'expiration proches.",
    color: "bg-orange-50 text-orange-600 border-orange-100"
  },
  {
    icon: Truck,
    title: "Gestion des fournisseurs",
    description: "Suivi des commandes, réapprovisionnement automatique et historique d'achats.",
    color: "bg-primary-50 text-primary-600 border-primary-100"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">Tout ce dont vous avez besoin</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Une gestion de pharmacie sans compromis
          </h3>
          <p className="text-lg text-gray-600">
            PharmaSaaS rassemble tous les outils nécessaires pour moderniser votre officine et vous concentrer sur vos patients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, translateY: -5 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:rotate-6 ${feature.color}`}>
                  <Icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
