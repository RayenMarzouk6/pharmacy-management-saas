'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken, removeAuthToken } from '@/lib/api';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'PHARMACIEN';

interface User {
  id: number;
  email: string;
  role: Role;
  pharmacieId?: number;
}

interface Subscription {
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED';
  trialDaysLeft?: number;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User, subData: Subscription) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth on mount
    const token = getAuthToken();
    if (token) {
      try {
        // Simple base64 decoding of JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        let finalRole: Role = 'PHARMACIEN';
        const rawRole = payload.role || payload.roles?.[0];
        
        if (rawRole === 'ADMIN' || rawRole === 'ADMIN_PHARMACIE') finalRole = 'ADMIN';
        else if (rawRole === 'SUPER_ADMIN' || rawRole === 'SUPERADMIN') finalRole = 'SUPER_ADMIN';
        
        setUser({
          id: payload.userId || payload.id || 1,
          email: payload.sub || payload.email || '',
          role: finalRole,
          pharmacieId: payload.pharmacieId,
        });
        
        // Check if backend provides subscription info in token, otherwise default ACTIVE
        setSubscription({
          status: payload.subStatus || 'ACTIVE',
          trialDaysLeft: payload.trialDaysLeft,
        });
      } catch (e) {
        console.error('Failed to parse JWT token', e);
        removeAuthToken();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // RBAC & Subscription Routing Logic
    if (loading) return;

    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
    const isPublic = publicPaths.includes(pathname);

    if (!user && !isPublic) {
      router.push('/login');
      return;
    }

    if (user) {
      // Block access if subscription expired (except for payment/pricing pages)
      if (subscription?.status === 'EXPIRED' && !pathname.includes('/payment') && !pathname.includes('/pricing')) {
        router.push('/payment');
        return;
      }

      // Role-based routing redirects
      if (isPublic && pathname === '/login') {
        if (user.role === 'SUPER_ADMIN') router.push('/superadmin/dashboard');
        else if (user.role === 'ADMIN') router.push('/admin/dashboard');
        else if (user.role === 'PHARMACIEN') router.push('/pharmacien/dashboard');
      }


      // Prevent users from accessing wrong role directories
      if (pathname.startsWith('/superadmin') && user.role !== 'SUPER_ADMIN') {
        router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/pharmacien/dashboard');
      }

      if (pathname.startsWith('/admin') && user.role === 'PHARMACIEN') {
        // Only block if not a shared page. For now, allow viewing medicaments/ventes as seen in Sidebar
        const sharedPages = ['/admin/medicaments', '/admin/ventes'];
        if (!sharedPages.includes(pathname)) {
          router.push('/pharmacien/dashboard');
        }
      }
    }
  }, [user, loading, pathname, router, subscription]);

  const login = (token: string, userData: User, subData: Subscription) => {
    localStorage.setItem('jwt_token', token); // Using simple localStorage for demo
    setUser(userData);
    setSubscription(subData);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setSubscription(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, subscription, isAuthenticated: !!user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
