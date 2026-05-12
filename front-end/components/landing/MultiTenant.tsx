'use client';

import { motion } from 'framer-motion';
import { Building2, UserCog, User, ArrowDown, Users } from 'lucide-react';

export default function MultiTenant() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">Architecture SaaS</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pensé pour les groupes et les indépendants
          </h3>
          <p className="text-lg text-gray-600">
            Une architecture multi-tenant robuste permettant de gérer une ou plusieurs pharmacies depuis une interface centralisée.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            
            {/* Super Admin */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 w-full md:w-2/3 flex items-center gap-6 relative z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Building2 size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Super Admin</h4>
                <p className="text-gray-500 text-sm mt-1">Propriétaire de la plateforme SaaS. Gère les pharmacies, les abonnements et visualise les statistiques globales.</p>
              </div>
            </motion.div>

            <ArrowDown className="text-gray-300 my-4" size={32} />

            {/* Pharmacies Level */}
            <div className="w-full grid md:grid-cols-2 gap-8 relative z-10">
              {/* Pharmacie 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-3xl shadow-md border border-t-4 border-t-primary-500 w-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <UserCog size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Admin Pharmacie</h4>
                    <p className="text-xs font-semibold text-primary-600 uppercase">Tenant 1</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex-1">Gère sa propre pharmacie, ses employés, son stock et ses fournisseurs de manière totalement isolée.</p>
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                  <Users className="text-gray-400" size={18} />
                  <span className="text-sm font-medium text-gray-600">Pharmaciens (Employés)</span>
                </div>
              </motion.div>

              {/* Pharmacie 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-3xl shadow-md border border-t-4 border-t-blue-500 w-full flex flex-col opacity-80 scale-95"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UserCog size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Admin Pharmacie</h4>
                    <p className="text-xs font-semibold text-blue-600 uppercase">Tenant 2</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex-1">Une autre pharmacie abonnée. Données 100% séparées et sécurisées.</p>
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                  <Users className="text-gray-400" size={18} />
                  <span className="text-sm font-medium text-gray-600">Pharmaciens (Employés)</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
