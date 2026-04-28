'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { productAPI } from '@/lib/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import FloatingBackground from '@/components/FloatingBackground';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAll();
      setProducts(response.data.products || []);
      setRetryCount(0);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Gagal memuat produk. Silakan coba lagi.');
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      loadProducts();
    } else {
      toast.error('Maksimal percobaan tercapai. Silakan refresh halaman.');
    }
  };

  const handleBuy = (product) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    addToCart(product, 1);
    toast.success(`${product.name} ditambahkan ke keranjang`);
    router.push('/cart');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-secondary/5" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto relative z-10"
        >
          {/* Main Heading */}
          <div className="text-center mb-12 space-y-6">
            <motion.div variants={itemVariants} className="inline-block">
              <span className="px-4 py-2 glass rounded-full text-sm font-semibold text-primary/80 glow-primary">
                🚀 Premium Account Store
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              <span className="gradient-text glow-text-neon">
                Belanja Akun Premium
              </span>
              <br />
              <span className="text-gray-300">dengan Harga Terbaik</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Nikmati pengalaman berbelanja yang smooth dengan teknologi terdepan. Pengiriman instan, aman, dan terpercaya.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/products')}
                className="px-8 py-4 gradient-primary text-white rounded-xl font-bold text-lg glow-primary hover:glow-primary-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                🛍️ Belanja Sekarang
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/products')}
                className="px-8 py-4 border-2 border-primary/50 text-primary rounded-xl font-bold text-lg hover:border-primary transition-all duration-300 flex items-center justify-center gap-2"
              >
                📚 Pelajari Lebih Lanjut
              </motion.button>
            </motion.div>
          </div>

          {/* Floating Stats */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            {[
              { number: '100+', label: 'Produk Tersedia' },
              { number: '10K+', label: 'Pelanggan Puas' },
              { number: '24/7', label: 'Support Kami' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-xl text-center border border-primary/20 hover:border-primary/50 transition"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Mengapa Pilih DOKZ STORE?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Kami menyediakan pengalaman terbaik untuk setiap pembelian Anda
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: '⚡',
              title: 'Pengiriman Instan',
              desc: 'Akun dikirim otomatis dalam detik setelah pembayaran',
              color: 'from-blue-500/10 to-cyan-500/10',
            },
            {
              icon: '🔒',
              title: 'Aman & Terpercaya',
              desc: 'Semua transaksi dilindungi dengan enkripsi tingkat bank',
              color: 'from-purple-500/10 to-pink-500/10',
            },
            {
              icon: '🎁',
              title: 'Harga Terbaik',
              desc: 'Harga paling kompetitif dan sering ada promo menarik',
              color: 'from-pink-500/10 to-red-500/10',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={featureVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`glass p-8 rounded-xl border border-primary/20 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br ${feature.color}`}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-primary">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Produk Unggulan</span>
          </h2>
          <div className="flex gap-4 mt-4">
            <div className="h-1 w-12 gradient-primary rounded-full" />
            <p className="text-gray-400">Pilihan terbaik dari koleksi kami</p>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <EmptyState
            icon="❌"
            title="Gagal Memuat Produk"
            description={error}
            onRetry={handleRetry}
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Tidak Ada Produk"
            description="Maaf, produk saat ini sedang tidak tersedia. Silakan coba lagi nanti."
            onRetry={handleRetry}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} onBuy={handleBuy} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => router.push('/products')}
              className="px-8 py-3 glass border border-primary/50 text-primary rounded-xl font-semibold hover:bg-primary/10 transition-all duration-300"
            >
              Lihat Semua Produk →
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
