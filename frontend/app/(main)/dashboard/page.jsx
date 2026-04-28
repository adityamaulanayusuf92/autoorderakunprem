'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user, router]);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Disalin ke clipboard');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500';
      case 'paid':
        return 'bg-blue-900/30 text-blue-300 border-blue-500';
      case 'delivered':
        return 'bg-green-900/30 text-green-300 border-green-500';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-500';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold glow-text">Dashboard</h1>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-gradient-primary text-white rounded font-semibold hover:shadow-lg glow-primary transition"
          >
            Belanja Lagi
          </button>
        </div>

        {/* User Info */}
        <div className="bg-dark-light border border-primary/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">{user.fullName}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Pesanan Anda</h2>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Belum ada pesanan</p>
              <Link
                href="/products"
                className="text-primary hover:underline"
              >
                Mulai belanja sekarang
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Orders List */}
              <div className="lg:col-span-2 space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-dark-light border rounded-lg p-4 cursor-pointer transition ${
                      selectedOrder?.id === order.id
                        ? 'border-primary'
                        : 'border-primary/30 hover:border-primary/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{order.order_number}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400 text-sm">{order.items.length} item</p>
                      <p className="font-bold text-primary">Rp {order.total_price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Detail */}
              {selectedOrder && (
                <div className="bg-dark-light border border-primary/30 rounded-lg p-6 h-fit">
                  <h3 className="font-bold mb-4">Detail Order</h3>

                  <div className="space-y-4">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="border-b border-primary/20 pb-4">
                        <p className="font-semibold mb-2">Item {i + 1}</p>
                        <p className="text-sm text-gray-400 mb-2">Produk: {item.product_id}</p>

                        {item.account_email && (
                          <>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between bg-dark p-2 rounded text-xs">
                                <span className="text-gray-400">Email:</span>
                                <span className="font-mono">{item.account_email}</span>
                              </div>
                              <div className="flex items-center justify-between bg-dark p-2 rounded text-xs">
                                <span className="text-gray-400">Password:</span>
                                <span className="font-mono">••••••••</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => copyToClipboard(item.account_email, `email-${i}`)}
                                className="flex-1 py-1 bg-primary/20 hover:bg-primary/30 rounded text-xs transition flex items-center justify-center gap-1"
                              >
                                {copiedId === `email-${i}` ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                {copiedId === `email-${i}` ? 'Disalin' : 'Email'}
                              </button>
                              <button
                                onClick={() => copyToClipboard(item.account_password, `pass-${i}`)}
                                className="flex-1 py-1 bg-primary/20 hover:bg-primary/30 rounded text-xs transition flex items-center justify-center gap-1"
                              >
                                {copiedId === `pass-${i}` ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                {copiedId === `pass-${i}` ? 'Disalin' : 'Password'}
                              </button>
                            </div>

                            {item.temp_mail_link && (
                              <a
                                href={item.temp_mail_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-center py-1 border border-primary/30 rounded text-xs hover:border-primary/60 transition"
                              >
                                Buka Temp Mail
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
