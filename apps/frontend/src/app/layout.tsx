import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'School SaaS App',
  description:
    'Streamlining school management for low to mid-level institutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ReactQueryProvider>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
