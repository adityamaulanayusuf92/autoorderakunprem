'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log('[AuthProvider] Mounting, checking auth...');
    checkAuth();
  }, []);

  useEffect(() => {
    console.log('[AuthProvider] User changed:', user);
  }, [user]);

  return children;
}
