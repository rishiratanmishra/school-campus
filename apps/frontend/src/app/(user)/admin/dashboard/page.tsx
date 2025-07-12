import { Suspense } from 'react';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '@/service';
import AdminDashboard from '@/components/users/admin/Dashboard/AdminDashboard';
import { getOrganisationListServer } from '@/service/SSR/OrganizationService.server';

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();

  // Prefetch data
  const organisationData = await getOrganisationListServer({});
  queryClient.setQueryData(
    [QUERY_KEYS.ORGANISATION, 'list', {}],
    organisationData
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AdminDashboardLoading />}>
        <AdminDashboard />
      </Suspense>
    </HydrationBoundary>
  );
}

function AdminDashboardLoading() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
