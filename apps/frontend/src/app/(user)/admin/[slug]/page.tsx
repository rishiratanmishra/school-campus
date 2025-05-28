'use client';

import AdminDashboard from '@/components/users/admin/Dashboard/AdminDashboard';
import { useGetUserList } from '@/service/UserService';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams<{ slug?: string | string[] }>();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { data: userlist } = useGetUserList({});
  console.log('User List:', userlist);
  return (
    <>
      <AdminDashboard />
    </>
  );
};

export default Page;
