'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function ProductCard({ product, onBuy }) {
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const getStatusColor = (status) => {
    return status === 'available' 
      ? 'bg-green-900/30 text-green-300 border-green-500'
      : 'bg-red-900/30 text-red-300 border-red-500';
  };

  const handleRipple = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = { id: Date.now(), x, y };

    setRipples([ripple]);
    setTimeout(() => setRipples([]), 600);
  };

  const handleClickButton = (e) => {
    handleRipple(e);
    onBuy(product);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      variants={hoverVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass rounded-xl overflow-hidden group relative border border-primary/20 hover:border-primary/50 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
        {/* Animated Icon */}
        <motion.div
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl opacity-20 group-hover:opacity-40 transition"
        >
          📦
        </motion.div>

        {/* Status Badge */}
        <motion.span
          animate={{ 
            y: isHovered ? -5 : 0,
          }}
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${getStatusColor(product.status)}`}
        >
          {product.status === 'available' ? '✓ Tersedia' : '✗ Habis'}
        </motion.span>

        {/* Glow overlay on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg group-hover:glow-text transition duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex justify-between items-center">
          <motion.span
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className="text-2xl font-bold gradient-text"
          >
            Rp {product.price.toLocaleString('id-ID')}
          </motion.span>

          {product.available_stock > 0 && (
            <motion.span
              animate={{ opacity: isHovered ? 1 : 0.6 }}
              className="text-xs text-gray-400 bg-primary/10 px-2 py-1 rounded-full"
            >
              {product.available_stock} stok
            </motion.span>
          )}
        </div>

        {/* Button */}
        <motion.button
          onClick={handleClickButton}
          whileHover={{ scale: product.status === 'available' ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          disabled={product.status !== 'available'}
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 relative overflow-hidden group/btn ${
            product.status === 'available'
              ? 'gradient-primary text-white glow-primary hover:glow-primary-xl'
              : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
          }`}
        >
          {/* Shimmer effect on hover */}
          {product.status === 'available' && (
            <motion.div
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white/10"
            />
          )}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {product.status === 'available' ? (
              <>
                🛒 Beli Sekarang
              </>
            ) : (
              'Habis Terjual'
            )}
          </span>

          {/* Ripple effects */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                }}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
