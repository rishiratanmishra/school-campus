'use client';

import React from 'react';
import LoginUserForm, { ILoginFormValues } from './LoginUserForm';
import { useLoginUser } from '@/service/UserService';
import { FormikHelpers } from 'formik';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AddLoginUserForm = () => {
  const loginUser = useLoginUser();
  const router = useRouter();

  const initialValues: ILoginFormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: ILoginFormValues,
    actions: FormikHelpers<ILoginFormValues>
  ) => {
    try {
      const response = await loginUser.mutateAsync(values);
      toast.success(response.message || 'Login successful');
      
      // Redirect to dashboard after successful login
      router.push('/admin/gg');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err?.message || 'Login failed');
      
      // Reset form on error
      actions.setFieldError('email', ' ');
      actions.setFieldError('password', err?.message || 'Invalid credentials');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please sign in to your account
        </p>
      </div>
      
      <LoginUserForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        isSubmitting={loginUser.isPending}
      />
    </div>
  );
};

export default AddLoginUserForm;