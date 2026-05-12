'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Pill, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-blue-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 font-medium text-sm mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              N°1 en Tunisie 🇹🇳
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Gérez votre pharmacie <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                intelligemment
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              La plateforme SaaS tout-en-un pour les pharmacies tunisiennes. Simplifiez vos ventes, suivez vos stocks en temps réel et optimisez vos commandes fournisseurs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all">
                Commencer gratuitement
                <ArrowRight size={20} />
              </Link>
              <a href="#demo" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                Voir la démo
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} />
                Données sécurisées
              </div>
              <div className="flex items-center gap-2">
                <Activity className="text-primary-500" size={18} />
                Temps réel
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Abstract UI Mockup */}
            <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 w-48 h-5 bg-white rounded-md border border-gray-200"></div>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <Pill size={20} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-100 mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-6 bg-gray-800 rounded"></div>
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-6 bg-gray-800 rounded"></div>
                  </motion.div>
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 mt-2 p-4">
                  <div className="w-full h-4 bg-gray-100 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                        <div className="flex-1">
                          <div className="w-3/4 h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Alerte Stock</p>
                <p className="font-bold text-gray-900">Doliprane 1000mg</p>
              </div>
            </motion.div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
