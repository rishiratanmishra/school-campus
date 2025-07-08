'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { CNTextInputField } from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Shield,
  Link,
} from 'lucide-react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

export const LoginZodSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
});

export type ILoginFormValues = z.infer<typeof LoginZodSchema>;

const validateForm = (values: ILoginFormValues) =>
  validateZodSchemaFormik({
    schema: LoginZodSchema,
    values,
  });

const LoginFormContent: React.FC<{ isSubmitting?: boolean }> = ({
  isSubmitting,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  return (
    <div className="space-y-2">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="h-3 w-3 text-white" />
            </div>
          </div>
        </div> */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your School Campus account</p>
      </motion.div>

      {/* Email Field */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative group">
          <CNTextInputField
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
          />
          <Mail
            style={{ top: '36%' }}
            className="absolute right-4 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative group">
          <CNTextInputField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4  transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors"
            style={{ top: '36%' }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Remember Me & Forgot Password */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-500 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <a
          href="#"
          className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          Forgot password?
        </a>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          disabled={isSubmitting}
        >
          <div className="flex items-center justify-center space-x-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </div>
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        className="relative my-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gray-50 text-gray-500">
            New to School Campus?
          </span>
        </div>
      </motion.div>

      {/* Sign Up Link */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <a
          onClick={() => router.push('/signup')}
          className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
        >
          <span>Create an account</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
};

interface LoginFormProps {
  initialValues: Partial<ILoginFormValues>;
  handleSubmit: (
    values: ILoginFormValues,
    actions: FormikHelpers<ILoginFormValues>
  ) => void | Promise<void>;
  isSubmitting: boolean;
}

const LoginUserForm: React.FC<LoginFormProps> = ({
  initialValues,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full translate-y-8 -translate-x-8" />

          {/* Form Content */}
          <div className="relative z-10">
            <FormikForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validate={validateForm}
            >
              <LoginFormContent isSubmitting={isSubmitting} />
            </FormikForm>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginUserForm;
