'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(10, 14, 39, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#e0e6ff',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.2)',
          padding: '16px 24px',
          fontWeight: '500',
          fontSize: '14px',
        },
        loading: {
          style: {
            background: 'rgba(10, 14, 39, 0.85)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
          },
        },
        success: {
          style: {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
          },
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
          },
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
