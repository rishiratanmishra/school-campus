'use client';

import AuthLayout from '@/components/layouts/authLayout/AuthLayout';
import '../../app/globals.css';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 10 minutes in milliseconds
      staleTime: 600000,
    },
  },
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthLayout>{children}</AuthLayout>
    </>
  );
}
