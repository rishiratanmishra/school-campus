'use client';

import React from 'react';
import LoginUserForm, { ILoginFormValues } from './LoginUserForm';
import { useLoginUser } from '@/service/UserService';
import { FormikHelpers } from 'formik';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { loginSuccess } from '@/store/auth/AuthenticationSlice';

const AddLoginUserForm = () => {
  const loginUser = useLoginUser();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

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

      console.log('Login response:', response); // ✅ Debug log

      // ✅ Extract user and token data correctly
      const userData = response.data; // user object is in `data`
      const tokenData = response.tokens || {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      console.log('User data:', userData);
      console.log('Token data:', tokenData);

      if (userData) {
        dispatch(
          loginSuccess({
            user: userData,
            tokens:
              tokenData?.accessToken && tokenData?.refreshToken
                ? {
                    accessToken: tokenData.accessToken,
                    refreshToken: tokenData.refreshToken,
                  }
                : undefined,
          })
        );

        console.log('Login success dispatched to Redux');
      } else {
        console.warn('No user data found in response');
        toast.error('Login failed: No user data received');
        return;
      }

      // Optional: Save tokens to localStorage
      if (typeof window !== 'undefined' && tokenData?.accessToken) {
        try {
          localStorage.setItem('auth-tokens', JSON.stringify(tokenData));
        } catch (error) {
          console.warn('Failed to store tokens in localStorage');
        }
      }

      toast.success(response.message || 'Login successful');

      // Wait briefly to ensure Redux is updated before routing
      setTimeout(() => {
        router.push('/admin/gg');
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);

      const errorMessage =
        err?.response?.data?.message || err?.message || 'Login failed';

      toast.error(errorMessage);

      if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((field) => {
          actions.setFieldError(field, errors[field]);
        });
      } else {
        actions.setFieldError('email', ' ');
        actions.setFieldError('password', errorMessage);
      }
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
