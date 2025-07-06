'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { CNTextInputField } from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import { z } from 'zod';

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <LogIn className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/70 text-sm">
          Sign in to continue your journey with Campus Connect
        </p>
      </motion.div>

      {/* Form Fields */}
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Email Field */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 group-hover:border-white/30 transition-all duration-300">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-white/50 ml-3 mr-2" />
              <CNTextInputField
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="bg-transparent border-0 text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-1 py-3 flex-1"
              />
            </div>
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 group-hover:border-white/30 transition-all duration-300">
            <div className="flex items-center">
              <Lock className="h-4 w-4 text-white/50 ml-3 mr-2" />
              <CNTextInputField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                className="bg-transparent border-0 text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg px-1 py-3 flex-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-white/50 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Forgot Password Link */}
      <motion.div
        className="text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <a
          href="#"
          className="text-sm text-indigo-400 hover:text-purple-400 transition-colors duration-300 hover:underline"
        >
          Forgot your password?
        </a>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        className="pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          type="submit"
          className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white border-0 rounded-xl h-12 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          disabled={isSubmitting}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                <span>Sign In</span>
              </>
            )}
          </div>
        </Button>
      </motion.div>

      {/* Sign Up Link */}
      <motion.div
        className="text-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <p className="text-white/60 text-sm">
          Don't have an account?{' '}
          <a
            href="#"
            className="text-indigo-400 hover:text-purple-400 font-medium transition-colors duration-300 hover:underline"
          >
            Sign up here
          </a>
        </p>
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
      className="w-full max-w-md mx-auto h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden w-full">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl" />

        {/* Floating elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse" />
        <div
          className="absolute bottom-4 left-4 w-3 h-3 bg-purple-400/30 rounded-full animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-2 w-1 h-1 bg-pink-400/30 rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        />

        <div className="relative z-10">
          <FormikForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={validateForm}
          >
            <LoginFormContent isSubmitting={isSubmitting} />
          </FormikForm>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginUserForm;
