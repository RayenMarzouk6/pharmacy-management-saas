'use client';

import Link from 'next/link';
import { Pill, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
              <Pill size={24} className="text-primary-600" />
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">PharmaSaaS</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Fonctionnalités</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Comment ça marche</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Tarifs</a>
            
            <div className="flex items-center gap-4 ml-4">
              <Link href="/login" className="text-gray-900 font-medium hover:text-primary-600 transition-colors">
                Se connecter
              </Link>
              <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5">
                Essayer gratuitement
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-100 shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <a href="#features" className="block px-3 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-50">Fonctionnalités</a>
              <a href="#how-it-works" className="block px-3 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-50">Comment ça marche</a>
              <a href="#pricing" className="block px-3 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-50">Tarifs</a>
              <div className="h-px bg-gray-100 my-2"></div>
              <Link href="/login" className="block px-3 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-50">Se connecter</Link>
              <Link href="/login" className="block mt-2 text-center bg-primary-600 text-white px-5 py-3 rounded-xl font-medium">
                Essayer gratuitement
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
