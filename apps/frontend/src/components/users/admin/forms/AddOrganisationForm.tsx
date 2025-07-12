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

  const initialValues: Partial<OrganisationFormValues> = {
    name: '',
    slug: '',
    domain: '',
    logo: '',
    coverImage: '',
    established: undefined,
    motto: '',
    description: '',
    organisationType: undefined,
    boardType: undefined,
    address: [
      {
        type: 'MAIN',
        street: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        isPrimary: false,
      },
    ],
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      website: '',
    },
    contactInfo: [
      {
        type: 'PHONE',
        label: '',
        value: '',
        extension: '',
        isPrimary: false,
        isPublic: true,
      },
    ],
    isActive: false,
  };

  const handleSubmit = async (
    values: OrganisationFormValues,
    { resetForm }: FormikHelpers<OrganisationFormValues>
  ) => {
    try {
      const cleanedValues = {
        ...values,
        address: values.address?.filter(
          (addr) =>
            addr.street ||
            addr.area ||
            addr.city ||
            addr.state ||
            addr.pincode ||
            addr.country
        ),
        contactInfo: values.contactInfo?.filter(
          (contact) => contact.value && contact.value.trim() !== ''
        ),
        socialMedia: Object.fromEntries(
          Object.entries(values.socialMedia || {}).filter(
            ([_, value]) => value && value.trim() !== ''
          )
        ),
      };

      const result = await createOrg.mutateAsync(cleanedValues);
      if (result) {
        toast.success('Organisation created successfully', {
          description: 'The organisation has been added to the system.',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo create'),
          },
        });
        resetForm();

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
