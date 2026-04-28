'use client';

import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';
import { orderAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import FloatingBackground from '@/components/FloatingBackground';
import EmptyState from '@/components/EmptyState';

export default function CartPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.total);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass rounded-2xl p-12 max-w-md w-full border border-primary/30"
        >
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold mb-2">Akses Terbatas</h1>
          <p className="text-gray-400 mb-8">Silakan login terlebih dahulu untuk melihat keranjang belanja Anda</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            className="w-full px-6 py-3 gradient-primary text-white rounded-lg font-bold glow-primary hover:glow-primary-xl transition"
          >
            🚀 Login Sekarang
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen relative py-12 px-4">
        <FloatingBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8 font-semibold"
          >
            <FiArrowLeft />
            Kembali Belanja
          </motion.button>

          <EmptyState
            icon="🛒"
            title="Keranjang Belanja Kosong"
            description="Belum ada produk di keranjang Anda. Mari mulai berbelanja sekarang!"
            onRetry={() => router.push('/products')}
          />
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.create({
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      clearCart();
      toast.success('✅ Order berhasil dibuat!');
      router.push(`/orders/${response.data.order.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || '❌ Checkout gagal');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <FloatingBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-6 font-semibold text-lg"
          >
            <FiArrowLeft size={20} />
            Kembali
          </button>

          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="gradient-text">Keranjang Belanja</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Anda memiliki <span className="text-primary font-bold">{cartItems.length}</span> item</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    exit="exit"
                    className="glass border border-primary/20 hover:border-primary/50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300"
                  >
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        📦 ID: {item.id}
                      </p>
                      <p className="text-primary font-bold text-lg mt-2">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 glass border border-primary/30 rounded-lg p-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          className="p-2 text-primary hover:text-primary/80"
                        >
                          −
                        </motion.button>
                        <span className="w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 text-primary hover:text-primary/80"
                        >
                          +
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, color: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          removeItem(item.id);
                          toast.success('Item dihapus dari keranjang');
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition"
                        title="Hapus item"
                      >
                        <FiTrash2 size={20} />
                      </motion.button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">Subtotal</p>
                      <p className="text-xl font-bold gradient-text">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass border border-primary/30 rounded-xl p-8 h-fit sticky top-32"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 gradient-text">Ringkasan</h2>

            {/* Items Summary */}
            <div className="space-y-3 mb-6 pb-6 border-b border-primary/20 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between text-sm text-gray-300"
                >
                  <span className="flex-1 truncate">
                    {item.name} <span className="text-primary">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold ml-4">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-lg">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Tax (5%)</span>
                <span className="text-lg">Rp {Math.floor(cartTotal * 0.05).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="text-3xl font-bold gradient-text">
                  Rp {(cartTotal + Math.floor(cartTotal * 0.05)).toLocaleString('id-ID')}
                </span>
              </div>
            </motion.div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 gradient-primary text-white rounded-lg font-bold text-lg glow-primary hover:glow-primary-xl disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⏳ Processing...
                </motion.span>
              ) : (
                '🛒 Checkout'
              )}
            </motion.button>

            {/* Continue Shopping */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/products')}
              className="w-full mt-3 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
            >
              Lanjut Belanja
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
