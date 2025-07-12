'use client';

import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store';
import { Toaster } from 'sonner';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={store}>
        <ReactQueryProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster richColors position="top-right" />
            {children}
          </PersistGate>
        </ReactQueryProvider>
      </Provider>
    </ThemeProvider>
  );
}
