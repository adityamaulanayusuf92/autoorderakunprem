'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to home');
      router.push('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      console.log('Login response:', response.data);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response: missing token or user');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);

      toast.success('Login berhasil!');
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Login gagal';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-light border border-primary/30 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8 glow-text text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-primary/30 rounded focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-primary/30 rounded focus:outline-none focus:border-primary transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-primary text-white rounded font-semibold hover:shadow-lg glow-primary disabled:opacity-50 transition"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
