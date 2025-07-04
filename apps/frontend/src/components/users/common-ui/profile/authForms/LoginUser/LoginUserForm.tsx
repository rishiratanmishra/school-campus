'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { CNTextInputField } from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import { CardContent } from '@/components/ui/card';
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
}) => (
  <div className="space-y-3">
    <CardContent className="grid grid-cols-1 gap-4">
      <CNTextInputField
        label="Email"
        name="email"
        type="email"
        placeholder="e.g. rishi@example.com"
        required
      />
      <CNTextInputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required
      />
    </CardContent>

    <div className="sticky -bottom-3 bg-background pt-4 pb-6 border-t">
      <Button
        type="submit"
        className="w-full h-12 text-base font-medium"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Logging In...
          </>
        ) : (
          'Login'
        )}
      </Button>
    </div>
  </div>
);

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
    <FormikForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validateForm}
    >
      <LoginFormContent isSubmitting={isSubmitting} />
    </FormikForm>
  );
};

export default LoginUserForm;
