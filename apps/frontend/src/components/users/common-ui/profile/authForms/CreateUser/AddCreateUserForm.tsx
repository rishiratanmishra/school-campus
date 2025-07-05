'use client';

import React from 'react';
import CreateUserForm from './CreateUserForm';
import { useCreateNewUser } from '@/service/UserService';
import { toast } from 'sonner';
import { FormikHelpers } from 'formik';
import { IUserFormValues } from './CreateUserForm';

const AddCreateUserForm = () => {
  const createNewUser = useCreateNewUser();

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
      actions.resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create user');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
      <CreateUserForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        isSubmitting={createNewUser.isPending}
      />
    </div>
  );
};

export default AddCreateUserForm;
