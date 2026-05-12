'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill } from 'lucide-react';

const notifications = [
  { id: 1, text: "Vente enregistrée", amount: "120 TND", time: "À l'instant" },
  { id: 2, text: "Vente enregistrée", amount: "45 TND", time: "À l'instant" },
  { id: 3, text: "Vente enregistrée", amount: "210 TND", time: "À l'instant" },
  { id: 4, text: "Réapprovisionnement", amount: "Validé", time: "À l'instant", type: "stock" },
];

export default function LiveNotification() {
  const [currentNotif, setCurrentNotif] = useState<{ id: number, text: string, amount: string, time: string, type?: string, uniqueId?: number } | null>(null);

  useEffect(() => {
    // Show a notification every 8-15 seconds
    const showRandomNotification = () => {
      const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotif({ ...randomNotif, uniqueId: Date.now() });

      // Hide after 4 seconds
      setTimeout(() => {
        setCurrentNotif(null);
      }, 4000);

      // Schedule next
      const nextTime = Math.floor(Math.random() * 7000) + 8000;
      setTimeout(showRandomNotification, nextTime);
    };

    // Start first cycle after 3 seconds
    const timer = setTimeout(showRandomNotification, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {currentNotif && (
          <motion.div
            key={currentNotif.uniqueId}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4 min-w-[280px]"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentNotif.type === 'stock' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              <Pill size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{currentNotif.text}</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${currentNotif.type === 'stock' ? 'text-blue-600' : 'text-green-600'}`}>
                  {currentNotif.amount}
                </span>
                <span className="text-xs text-gray-400">• {currentNotif.time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
