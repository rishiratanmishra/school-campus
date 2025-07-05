'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { CNTextInputField } from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import { CardContent } from '@/components/ui/card';
import { IUserZS, UserZodSchema } from 'api-definitions/features/user/user.zod';

export type IUserFormValues = IUserZS;

const validateForm = (values: IUserFormValues) =>
  validateZodSchemaFormik({
    schema: UserZodSchema,
    values,
  });

const CreateUserFormContent: React.FC<{ isSubmitting?: boolean }> = ({
  isSubmitting,
}) => (
  <div className="space-y-3">
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CNTextInputField
        label="First Name"
        name="name.first"
        placeholder="e.g. Rishi"
        required
      />
      <CNTextInputField
        label="Middle Name"
        name="name.middle"
        placeholder="e.g. Kumar"
      />
      <CNTextInputField
        label="Last Name"
        name="name.last"
        placeholder="e.g. Sharma"
        required
      />
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
        placeholder="Enter a secure password"
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
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </div>
  </div>
);

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
    <FormikForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validateForm}
      enableReinitialize
    >
      <CreateUserFormContent isSubmitting={isSubmitting} />
    </FormikForm>
  );
};

export default CreateUserForm;
