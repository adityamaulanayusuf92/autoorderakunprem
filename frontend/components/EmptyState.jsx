'use client';

import { motion } from 'framer-motion';

export default function EmptyState({ icon = '📦', title = 'Tidak Ada Produk', description = 'Silakan coba lagi nanti', onRetry }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-96 py-12"
    >
      {/* Icon */}
      <motion.div
        variants={itemVariants}
        className="mb-6 relative"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl drop-shadow-lg"
        >
          {icon}
        </motion.div>
        
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30 glow-primary"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ top: '-20px', left: '-20px', right: '-20px', bottom: '-20px' }}
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={itemVariants}
        className="text-2xl font-bold mb-2 text-center glow-text"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="text-gray-400 text-center mb-8 max-w-sm"
      >
        {description}
      </motion.p>

      {/* Retry Button */}
      {onRetry && (
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 gradient-primary rounded-lg font-semibold text-white glow-primary hover:glow-primary-xl transition"
        >
          🔄 Muat Ulang
        </motion.button>
      )}
    </motion.div>
  );
}
