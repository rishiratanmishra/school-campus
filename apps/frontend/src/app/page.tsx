"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
    const router = useRouter();
  return (
    <div className="h-[100vh] w-full flex justify-center items-center">
          <Button onClick={() => router.push('/admin/gg')} className="bg-blue-500 text-white">
              Go to school
    </Button>
    </div>
  );
};

export default Page;
