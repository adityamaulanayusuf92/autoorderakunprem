import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import ToastProvider from '@/components/ToastProvider';

export const metadata = {
  title: 'DOKZ STORE - Premium Account Store',
  description: 'Toko digital terpercaya untuk membeli akun premium berbagai layanan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <ToastProvider />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
