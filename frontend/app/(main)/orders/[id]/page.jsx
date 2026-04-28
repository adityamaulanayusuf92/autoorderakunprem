'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { orderAPI, adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrder();
  }, [user, router, params]);

  const loadOrder = async () => {
    try {
      const response = await orderAPI.getById(params.id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Gagal memuat pesanan');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setProcessLoading(true);
    try {
      await orderAPI.confirmPayment(params.id);
      toast.success('Pembayaran berhasil dikonfirmasi');
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal mengkonfirmasi pembayaran');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleApproveOrder = async () => {
    setProcessLoading(true);
    try {
      await adminAPI.approvePendingOrder(params.id);
      toast.success('Pesanan berhasil disetujui');
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal menyetujui pesanan');
    } finally {
      setProcessLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order tidak ditemukan</div>;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-dark-light border border-primary/30 rounded-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold glow-text mb-2">{order.order_number}</h1>
                <p className="text-gray-400">
                  Dibuat: {new Date(order.created_at).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <span className="px-4 py-2 bg-blue-900/30 text-blue-300 border border-blue-500 rounded-full font-semibold">
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Item Pesanan</h2>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="bg-dark border border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">Item {i + 1}</p>
                        <p className="text-gray-400 text-sm">Product ID: {item.product_id}</p>
                      </div>
                      <p className="font-bold text-primary">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>

                    {item.account_email ? (
                      <div className="bg-dark-light p-4 rounded border border-green-500/30">
                        <p className="text-xs text-green-400 mb-3 font-semibold">✓ AKUN TELAH DIKIRIM</p>
                        <div className="space-y-2 text-sm">
                          <div className="font-mono">Email: {item.account_email}</div>
                          <div className="font-mono">Password: {'*'.repeat(item.account_password.length)}</div>
                          {item.temp_mail_link && (
                            <a
                              href={item.temp_mail_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              → Buka Temp Mail
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">Akun belum dikirim</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-primary/30 pt-8 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Subtotal</span>
                <span>Rp {order.total_price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">Rp {order.total_price.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {order.status === 'pending' && (
                <button
                  onClick={handleConfirmPayment}
                  disabled={processLoading}
                  className="w-full py-3 bg-gradient-primary text-white rounded font-semibold hover:shadow-lg glow-primary disabled:opacity-50 transition"
                >
                  {processLoading ? 'Processing...' : 'Konfirmasi Pembayaran'}
                </button>
              )}

              {user?.role === 'admin' && order.status === 'pending' && (
                <button
                  onClick={handleApproveOrder}
                  disabled={processLoading}
                  className="w-full py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {processLoading ? 'Processing...' : 'Setujui Pesanan'}
                </button>
              )}

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 border border-primary/30 hover:border-primary/60 rounded font-semibold transition"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
