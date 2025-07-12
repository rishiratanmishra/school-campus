'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { CNTextInputField } from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import { IUserZS, UserZodSchema } from 'api-definitions/features/user/user.zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Shield,
  User,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export type IUserFormValues = IUserZS;

const validateForm = (values: IUserFormValues) =>
  validateZodSchemaFormik({
    schema: UserZodSchema,
    values,
  });

// Step validation functions
const validateStep1 = (values: IUserFormValues) => {
  const errors: any = {};
  if (!values.name?.first) errors.firstName = 'First name is required';
  if (!values.name?.last) errors.lastName = 'Last name is required';
  return errors;
};

const validateStep2 = (values: IUserFormValues) => {
  const errors: any = {};
  if (!values.email) errors.email = 'Email is required';
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
};

const validateStep3 = (values: IUserFormValues) => {
  const errors: any = {};
  if (!values.password) errors.password = 'Password is required';
  if (values.password && values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  return errors;
};

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Email', icon: Mail },
  { id: 3, title: 'Security', icon: Lock },
  { id: 4, title: 'Terms', icon: FileText },
];

const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;
        const IconComponent = step.icon;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500'
                    : isActive
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-100 border-gray-300'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                )}
              </motion.div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{
                    width: isCompleted ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const CreateUserFormContent: React.FC<{
  isSubmitting?: boolean;
  values: IUserFormValues;
}> = ({ isSubmitting, values }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const router = useRouter();

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return values.name?.first && values.name?.last;
      case 2:
        return values.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      case 3:
        return values.password && values.password.length >= 8;
      case 4:
        return termsAccepted;
      default:
        return false;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label
                  htmlFor="name.first"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="relative group">
                  <CNTextInputField
                    id="name.first"
                    name="name.first"
                    placeholder="First name"
                    className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                  <User
                    style={{ top: '36%' }}
                    className="absolute right-4  transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="name.last"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="relative group">
                  <CNTextInputField
                    id="name.last"
                    name="name.last"
                    placeholder="Last name"
                    className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                  <User
                    style={{ top: '36%' }}
                    className="absolute right-4  transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="name.middle"
                className="text-sm font-medium text-gray-700"
              >
                Middle Name <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative group">
                <CNTextInputField
                  id="name.middle"
                  name="name.middle"
                  placeholder="Middle name (optional)"
                  className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
                <User
                  style={{ top: '36%' }}
                  className="absolute right-4  transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative group">
                <CNTextInputField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
                <Mail
                  style={{ top: '36%' }}
                  className="absolute right-4  transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative group">
                <CNTextInputField
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Password must be at least 8 characters long
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {values.name?.first} {values.name?.middle}{' '}
                    {values.name?.last}
                  </p>
                  <p className="text-sm text-gray-600">Your name</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{values.email}</p>
                  <p className="text-sm text-gray-600">Email address</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
                I agree to the{' '}
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="h-3 w-3 text-white" />
            </div>
          </div>
        </div> */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create Account
        </h1>
        <p className="text-gray-600 text-sm">Join School Campus today</p>
      </motion.div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {/* Form Steps */}
      <div className="min-h-[220px] relative">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        {currentStep < 4 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!canProceed() || isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Sign In Link */}
      <motion.div
        className="text-center pt-4 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <a
          onClick={() => router.push('/login')}
          className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer text-sm"
        >
          <span>Already have an account? Sign in</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
};

interface CreateUserFormProps {
  initialValues: Partial<IUserFormValues>;
  handleSubmit: (
    values: IUserFormValues,
    actions: FormikHelpers<IUserFormValues>
  ) => void | Promise<void>;
  isSubmitting: boolean;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
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
              enableReinitialize
            >
              {({ values }) => (
                <CreateUserFormContent
                  isSubmitting={isSubmitting}
                  values={values}
                />
              )}
            </FormikForm>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateUserForm;
