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
      const userData = response.data;
      const tokenData = response.tokens || {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

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
      } else {
        console.warn('No user data found in response');
        toast.error('Login failed: No user data received');
        return;
      }

      if (typeof window !== 'undefined' && tokenData?.accessToken) {
        try {
          localStorage.setItem('auth-tokens', JSON.stringify(tokenData));
        } catch (error) {
          console.warn('Failed to store tokens in localStorage');
        }
      }

      // Success toast with modern styling
      toast.success(response.message || 'Welcome back! Login successful 🎉', {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
        },
      });

      setTimeout(() => {
        router.push('/');
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);

      const errorMessage =
        err?.response?.data?.message || err?.message || 'Login failed';

      // Error toast with modern styling
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
        },
      });

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
    <LoginUserForm
      initialValues={initialValues}
      handleSubmit={handleSubmit}
      isSubmitting={loginUser.isPending}
    />
  );
};

export default AddLoginUserForm;
