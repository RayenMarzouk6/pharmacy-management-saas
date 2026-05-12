'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Amira Ben Ali",
    pharmacy: "Pharmacie de la Marsa",
    content: "Depuis que nous utilisons PharmaSaaS, nous avons réduit nos erreurs de stock de 90%. La caisse est incroyablement rapide, même pendant nos heures de pointe.",
    rating: 5,
  },
  {
    name: "Dr. Sami Trabelsi",
    pharmacy: "Pharmacie Centrale (Sfax)",
    content: "Gérer mes 3 pharmacies était un cauchemar avant. Avec la vue Super Admin, je contrôle tout depuis mon iPad. Le support local est super réactif.",
    rating: 5,
  },
  {
    name: "Dr. Yosra Mansour",
    pharmacy: "Pharmacie de Nuit Sousse",
    content: "L'interface est très intuitive. Mes nouveaux préparateurs en pharmacie sont opérationnels en 10 minutes. C'est le meilleur logiciel sur le marché tunisien.",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">Témoignages</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h3>
          <p className="text-lg text-gray-600">
            Rejoignez des centaines de pharmaciens tunisiens qui ont modernisé leur officine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                  {testimonial.name.charAt(4)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.pharmacy}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
