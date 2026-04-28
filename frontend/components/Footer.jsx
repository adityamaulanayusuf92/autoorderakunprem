'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="gradient-dark border-t border-primary/30 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4 glow-text">DOKZ STORE</h3>
            <p className="text-gray-400 text-sm">Premium account store dengan pengiriman otomatis</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-primary transition">Semua Produk</Link></li>
              <li><Link href="/" className="hover:text-primary transition">Kategori</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Tentang</a></li>
              <li><a href="#" className="hover:text-primary transition">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary/30 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 DOKZ STORE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
