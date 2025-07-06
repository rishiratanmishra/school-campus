'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { CNTextInputField } from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
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
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <CNTextInputField
        label="First Name"
        name="name.first"
        placeholder="First name"
      />
      <CNTextInputField
        label="Last Name"
        name="name.last"
        placeholder="Last name"
      />
    </div>

    <CNTextInputField
      label="Middle Name"
      name="name.middle"
      placeholder="Middle name (optional)"
    />

    <CNTextInputField
      label="Email"
      name="email"
      type="email"
      placeholder="your@email.com"
    />

    <CNTextInputField
      label="Password"
      name="password"
      type="password"
      placeholder="Create a password"
    />

    <Button
      type="submit"
      className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-md h-11"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Creating...
        </>
      ) : (
        'Create Account'
      )}
    </Button>
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
