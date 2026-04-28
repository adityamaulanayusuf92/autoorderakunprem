'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUsers, FiPackage, FiDollarSign, FiShoppingCart } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadDashboard();
  }, [user, router]);

  const loadDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Gagal memuat dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 glow-text">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-primary/30">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'products', label: 'Produk' },
            { id: 'orders', label: 'Pesanan' },
            { id: 'users', label: 'Pengguna' },
            { id: 'logs', label: 'Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboard && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: FiShoppingCart, label: 'Total Orders', value: dashboard.totalOrders },
              { icon: FiDollarSign, label: 'Revenue', value: `Rp ${dashboard.totalRevenue.toLocaleString('id-ID')}` },
              { icon: FiUsers, label: 'Users', value: dashboard.totalUsers },
              { icon: FiPackage, label: 'Products', value: dashboard.totalProducts },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-dark-light border border-primary/30 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon size={32} className="text-primary opacity-50" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <button
              className="px-6 py-2 bg-gradient-primary text-white rounded font-semibold hover:shadow-lg glow-primary transition"
            >
              + Tambah Produk
            </button>
            <p className="text-gray-400">Fitur manajemen produk akan ditampilkan di sini</p>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <p className="text-gray-400">Fitur manajemen pesanan akan ditampilkan di sini</p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <p className="text-gray-400">Fitur manajemen pengguna akan ditampilkan di sini</p>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <p className="text-gray-400">Activity logs akan ditampilkan di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}
