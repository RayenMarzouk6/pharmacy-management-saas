'use client';

import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 z-10">
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:bg-white focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm text-foreground"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.email.split('@')[0] || 'Utilisateur'}</p>
            <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Administrateur' : user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Pharmacien'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}

