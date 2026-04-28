'use client';

import { motion } from 'framer-motion';

export default function FloatingBackground() {
  const blobs = [
    {
      id: 1,
      size: 300,
      top: '10%',
      left: '5%',
      color: 'from-blue-500/10 to-purple-500/10',
      duration: 15,
      delay: 0,
    },
    {
      id: 2,
      size: 250,
      top: '60%',
      left: '70%',
      color: 'from-purple-500/10 to-pink-500/10',
      duration: 18,
      delay: 2,
    },
    {
      id: 3,
      size: 280,
      top: '40%',
      left: '35%',
      color: 'from-pink-500/10 to-blue-500/10',
      duration: 20,
      delay: 4,
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full bg-gradient-to-br ${blob.color} blur-3xl`}
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
          }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}
