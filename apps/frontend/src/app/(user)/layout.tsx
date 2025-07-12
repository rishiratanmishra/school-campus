'use client';

import UserLayout from '@/components/layouts/authLayout/UserLayout/UserLayout';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/AuthenticationSlice';
import AuthGuard from '@/lib/providers/AuthGuard';
import AdminLayout from '@/components/layouts/authLayout/AdminLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector(selectCurrentUser);
  const role = user?.role;

  return (
    <AuthGuard>
      {role === 'ADMIN' ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <UserLayout>{children}</UserLayout>
      )}
    </AuthGuard>
  );
}
