'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  Users, 
  Building2, 
  Truck,
  Settings,
  LogOut,
  Activity,
  Receipt
} from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'SUPER_ADMIN') {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/superadmin/dashboard' },
        { name: 'Pharmacies', icon: Building2, href: '/superadmin/pharmacies' },
        { name: 'Abonnements', icon: Activity, href: '/superadmin/subscriptions' },
        { name: 'Paramètres', icon: Settings, href: '/superadmin/settings' },
      ];
    }
    
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Médicaments', icon: Pill, href: '/admin/medicaments' },
        { name: 'Ventes', icon: Receipt, href: '/admin/ventes' },
        { name: 'Fournisseurs', icon: Truck, href: '/admin/fournisseurs' },
        { name: 'Pharmaciens', icon: Users, href: '/admin/pharmaciens' },
        { name: 'Abonnement', icon: Activity, href: '/admin/abonnement' },
        { name: 'Paramètres', icon: Settings, href: '/admin/settings' },
      ];
    }

    // Default for PHARMACIEN
    return [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/pharmacien/dashboard' },
      { name: 'Caisse (POS)', icon: ShoppingCart, href: '/pos' },
      { name: 'Médicaments', icon: Pill, href: '/admin/medicaments' },
      { name: 'Ventes', icon: Activity, href: '/admin/ventes' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col transition-all">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3 text-primary-600">
          <Pill size={24} className="animate-pulse" />
          <span className="font-bold text-xl text-foreground tracking-tight">PharmaSaaS</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-foreground'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary-500' : ''} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Link
          href={user?.role === 'ADMIN' ? '/admin/settings' : (user?.role === 'SUPER_ADMIN' ? '/superadmin/settings' : '/settings')}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-foreground transition-all"
        >
          <Settings size={20} />
          Paramètres
        </Link>
        <button
          className="w-full mt-2 flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('jwt_token');
              window.location.href = '/login';
            }
          }}
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
