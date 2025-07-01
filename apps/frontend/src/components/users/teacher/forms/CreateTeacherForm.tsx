'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  CNTextInputField,
  CNCheckboxField,
} from '@/components/ui/fields';
import { CardContent } from '@/components/ui/card';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import { FormikHelpers } from 'formik';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import TeacherZodSchema, { ITeacherZS } from 'api-definitions/features/teacher/teacher.zod';

interface CreateTeacherFormContentProps {
  isSubmitting?: boolean;
}

const CreateTeacherFormContent: React.FC<CreateTeacherFormContentProps> = ({
  isSubmitting = false,
}) => (
  <div className="space-y-3">
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CNTextInputField
        label="First Name"
        name="name.first"
        placeholder="e.g. Sunita"
        required
      />
      <CNTextInputField
        label="Middle Name"
        name="name.middle"
        placeholder="e.g. Kumari"
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
        placeholder="e.g. sunita@example.com"
        required
      />
      <CNTextInputField
        label="Phone Number"
        name="phoneNumber"
        placeholder="e.g. 9876543210"
      />
      <CNTextInputField
        label="Qualification"
        name="qualification"
        placeholder="e.g. M.Sc Mathematics"
      />
      <CNTextInputField
        label="Department"
        name="department"
        placeholder="e.g. Science"
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
            Creating Teacher...
          </>
        ) : (
          'Create Teacher'
        )}
      </Button>
    </div>
  </div>
);



export type TeacherFormValues = ITeacherZS;

const validateForm = (values: TeacherFormValues) =>
  validateZodSchemaFormik({
    schema: TeacherZodSchema,
    values,
  });

interface CreateTeacherFormProps {
  initialValues: Partial<TeacherFormValues>;
  onSubmit: (
    values: TeacherFormValues,
    formikHelpers: FormikHelpers<TeacherFormValues>
  ) => void | Promise<void>;
  isSubmitting?: boolean;
}

const CreateTeacherForm: React.FC<CreateTeacherFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <FormikForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      enableReinitialize
    >
      <CreateTeacherFormContent isSubmitting={isSubmitting} />
    </FormikForm>
  );
};

export default CreateTeacherForm;
