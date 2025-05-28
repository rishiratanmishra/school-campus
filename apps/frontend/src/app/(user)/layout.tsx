'use client';

import AuthLayout from '@/components/layouts/authLayout/AuthLayout';
import '../../app/globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
