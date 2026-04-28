'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import FloatingBackground from '@/components/FloatingBackground';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function ProductsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const categories = ['all', 'Streaming', 'Video Editing', 'AI', 'Design', 'Music', 'Photo Editing', 'Health'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

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

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleBuy = (product) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    addToCart(product, 1);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <FloatingBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="gradient-text">Jelajahi Semua Produk</span>
          </h1>
          <p className="text-gray-400 text-lg">Temukan produk premium yang Anda cari</p>
        </motion.div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <FiSearch className="absolute left-4 top-4 text-primary/60 text-lg" />
            <input
              type="text"
              placeholder="🔍 Cari produk favorit Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 glass rounded-xl focus:outline-none focus:border-primary/80 transition border border-primary/30 text-gray-300 placeholder-gray-500"
            />
          </motion.div>

          {/* Filter Toggle Mobile */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 py-3 glass border border-primary/30 rounded-xl hover:border-primary/50 transition font-semibold"
            >
              <FiFilter />
              {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
            </motion.button>
          </div>

          {/* Filter Categories */}
          <AnimatePresence>
            {(showFilters || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-2 pb-4"
              >
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'gradient-primary text-white glow-primary shadow-lg'
                        : 'glass border border-primary/30 hover:border-primary/60 text-gray-300'
                    }`}
                  >
                    {cat === 'all' ? '📦 Semua' : cat}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Counter */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-gray-400"
          >
            Menampilkan <span className="text-primary font-semibold">{filteredProducts.length}</span> dari {products.length} produk
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton count={12} />
        ) : error ? (
          <EmptyState
            icon="❌"
            title="Gagal Memuat Produk"
            description={error}
            onRetry={handleRetry}
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Produk Tidak Ditemukan"
            description="Maaf, produk yang Anda cari tidak tersedia saat ini. Coba ubah filter atau cari kata kunci lain."
            onRetry={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} onBuy={handleBuy} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
