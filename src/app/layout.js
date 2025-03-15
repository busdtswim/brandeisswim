// src/app/layout.js
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';

export const metadata = {
  title: 'Brandeis Swimming Lessons',
  description: 'Learn to swim with Brandeis University',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <Providers>
          <Header />
          <main className="flex-1 mt-16 md:mt-20 text-black">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}