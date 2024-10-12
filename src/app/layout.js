import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'Brandeis Swimming Lessons',
  description: 'Learn to swim with Brandeis University',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-blue-100 flex flex-col overflow-x-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        {/* Main Content */}
        <main className="flex-1 pt-16 p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
