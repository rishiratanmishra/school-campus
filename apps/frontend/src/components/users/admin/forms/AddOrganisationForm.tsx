// AddOrganisationForm.tsx
'use client';

import React from 'react';
import OrganisationForm, { OrganisationFormValues } from './OrganisationForm';
import { useCreateOrganisation } from '@/service/OrganisationService';
import { toast } from 'sonner';
import { FormikHelpers } from 'formik';

interface AddOrganisationFormProps {
  onFormSubmit?: () => void;
}

const AddOrganisationForm: React.FC<AddOrganisationFormProps> = ({
  onFormSubmit,
}) => {
  const createOrg = useCreateOrganisation();

  const initialValues = {
    name: '',
    slug: '',
    domain: '',
    established: null,
    description: '',
    organisationType: '',
    boardType: '',
    isActive: false,
  };

  const handleSubmit = async (
    values: OrganisationFormValues,
    { resetForm }: FormikHelpers<OrganisationFormValues>
  ) => {
    try {
      const result = await createOrg.mutateAsync(values);
      if (result) {
        toast.success('Organisation created successfully', {
          description: 'The organisation has been added to the system.',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo create'),
          },
        });
        resetForm();

        // Close drawer after successful submission
        if (onFormSubmit) {
          onFormSubmit();
        }
      }
    } catch (error) {
      console.error('Failed to create organisation', error);
      toast.error('Error creating organisation', {
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <OrganisationForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={createOrg.isPending}
    />
  );
};

export default AddOrganisationForm;
