'use client';

import { motion } from 'framer-motion';

export default function LoadingSkeleton({ count = 6 }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={item}
          className="glass rounded-lg overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="h-40 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 animate-shimmer" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-5 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full w-3/4 animate-shimmer" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full w-full animate-shimmer" />
              <div className="h-3 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full w-5/6 animate-shimmer" />
            </div>

            {/* Price & Button */}
            <div className="flex justify-between items-end pt-2">
              <div className="h-6 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full w-1/3 animate-shimmer" />
              <div className="h-8 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full w-1/4 animate-shimmer" />
            </div>

            {/* Button */}
            <div className="h-10 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-lg w-full animate-shimmer" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
