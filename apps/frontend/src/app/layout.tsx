'use client';

import './globals.css';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider';
import { Toaster } from 'sonner';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store'; 


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
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Toaster richColors position="top-right" />
                {children}
              </PersistGate>
            </Provider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
