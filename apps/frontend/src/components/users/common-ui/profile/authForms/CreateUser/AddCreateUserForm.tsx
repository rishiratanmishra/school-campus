'use client';

import React from 'react';
import CreateUserForm from './CreateUserForm';
import { useCreateNewUser } from '@/service/UserService';
import { toast } from 'sonner';
import { FormikHelpers } from 'formik';
import { IUserFormValues } from './CreateUserForm';
import { useRouter } from 'next/navigation';

const AddCreateUserForm = () => {
  const createNewUser = useCreateNewUser();
  const router = useRouter();
  const initialValues: IUserFormValues = {
    name: { first: '', middle: '', last: '' },
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: IUserFormValues,
    actions: FormikHelpers<IUserFormValues>
  ) => {
    try {
      await createNewUser.mutateAsync(values);
      toast.success('User created successfully');
      router.push('/login');
      actions.resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create user');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <CreateUserForm
      initialValues={initialValues}
      handleSubmit={handleSubmit}
      isSubmitting={createNewUser.isPending}
    />
  );
};

export default AddCreateUserForm;
