// src/app/layout.tsx
'use client';

import Header from '../components/layout/Header';
import Sidebar, { useSidebarCollapse } from '../components/layout/Sidebar';
import './globals.css';
import { Poppins, Montserrat } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { collapsed, setCollapsed } = useSidebarCollapse();

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="font-poppins flex bg-gray-50 text-gray-800">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  );
}