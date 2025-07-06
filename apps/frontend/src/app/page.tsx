'use client';
import { Button } from '@/components/ui/button';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAuthInitialized,
} from '@/store/auth/AuthenticationSlice';
import { is } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Page = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isInitialized) {
    useEffect(() => {
      router.push('/login');
    }, [!isInitialized]);
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  useLayoutEffect(() => {
    if (isAuthenticated && user.role === 'USER') {
      return;
    } else if (isAuthenticated && user.role === 'STUDENT') {
      router.push('/student');
    } else if (isAuthenticated && user.role === 'ADMIN') {
      router.push('/admin/gg');
    }
  }, [user]);

  return (
    <div className="h-[100vh] w-full flex justify-center items-center">
      <Button
        onClick={() => router.push('/admin/gg')}
        className="bg-blue-500 text-white"
      >
        Go to school
      </Button>
    </div>
  );
};

export default Page;
