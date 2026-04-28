'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCartCount());
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/');
  };

  const navVariants = {
    hidden: { y: -100 },
    show: { y: 0, transition: { duration: 0.4 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 300 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 300, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    show: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="show"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass border-b border-primary/30' : 'bg-transparent border-b border-primary/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary"
            >
              <span className="font-bold text-white">DZ</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold glow-text hidden sm:inline"
            >
              DOKZ STORE
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin', special: true }] : []),
            ].map((item, i) => (
              <motion.div key={item.href} custom={i} variants={linkVariants}>
                <Link
                  href={item.href}
                  className={`relative group font-medium transition-colors ${
                    item.special ? 'text-secondary hover:text-purple-400' : 'text-gray-300 hover:text-primary'
                  }`}
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="hidden sm:flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg border border-primary/50 text-gray-300 hover:text-primary hover:border-primary transition"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg gradient-primary text-white hover:shadow-lg glow-primary transition font-semibold"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/cart" className="relative p-2 hover:text-primary transition">
                    <FiShoppingCart size={20} />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center glow-secondary font-bold text-center text-[10px]"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/dashboard" className="p-2 hover:text-primary transition">
                    <FiUser size={20} />
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 hover:text-red-400 transition"
                >
                  <FiLogOut size={20} />
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:text-primary transition"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden glass border-t border-primary/30 rounded-b-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/products', label: 'Products' },
                  ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
                ].map((item, i) => (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={linkVariants}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 px-4 text-gray-300 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {!user && (
                  <div className="pt-2 border-t border-primary/20 space-y-2">
                    <motion.div custom={3} variants={linkVariants}>
                      <Link
                        href="/login"
                        className="block py-2 px-4 text-center border border-primary/50 rounded-lg hover:bg-primary/10 transition"
                        onClick={() => setMobileOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div custom={4} variants={linkVariants}>
                      <Link
                        href="/register"
                        className="block py-2 px-4 text-center gradient-primary text-white rounded-lg hover:shadow-lg transition font-semibold"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </div>
                )}

                {user && (
                  <div className="pt-2 border-t border-primary/20 space-y-2">
                    <motion.div custom={3} variants={linkVariants}>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 py-2 px-4 text-gray-300 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                        onClick={() => setMobileOpen(false)}
                      >
                        <FiUser size={18} />
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div custom={4} variants={linkVariants}>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 py-2 px-4 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <FiLogOut size={18} />
                        Logout
                      </button>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
