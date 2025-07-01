'use client';
import OrganisationDetails from '@/components/users/admin/Dashboard/Organisation/OrganisationDetails';
import { useGetOrganisationDetails } from '@/service/OrganisationService';
import { useParams } from 'next/navigation';
import React from 'react';

const page = () => {
  const params = useParams();
  const organisationId = params.slug;
  const { data: organisation } = useGetOrganisationDetails({
    _id: organisationId,
  });
  console.log('Organisation Details:', organisation);
  return (
    <div>
      <OrganisationDetails organisation={organisation?.data} />
    </div>
  );
};

export default page;
