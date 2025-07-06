'use client';

import AuthLayout from '@/components/layouts/authLayout/AuthLayout';
import '../../app/globals.css';
import { QueryClient } from '@tanstack/react-query';
import UserLayout from '@/components/layouts/authLayout/UserLayout/UserLayout';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/AuthenticationSlice';
import { log } from 'console';
import { useLayoutEffect, useState } from 'react';

type UserRole = 'USER' | 'STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT';

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
  const user = useSelector(selectCurrentUser);
  const [role, setRole] = useState<UserRole>('USER');
  useLayoutEffect(() => {
    if (user?.role === 'STUDENT') {
      setRole('STUDENT');
    }
  }, [user]);

  return (
    <>
      {role === 'STUDENT' ? (
        <UserLayout>{children}</UserLayout>
      ) : (
        <AuthLayout>{children}</AuthLayout>
      )}
    </>
  );
}
