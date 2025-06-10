'use client';

import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import {
  CNTextInputField,
  CNSelectField,
  CNCheckboxField,
} from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, AtSign, Calendar, Award } from 'lucide-react';
import StudentZodSchema, {
  IStudentZS,
} from 'api-definitions/features/student/student.zod';

export type StudentFormValues = IStudentZS;

const validateForm = (values: StudentFormValues) =>
  validateZodSchemaFormik({
    schema: StudentZodSchema,
    values,
  });

interface CreateStudentFormContentProps {
  isSubmitting?: boolean;
}

const CreateStudentFormContent: React.FC<CreateStudentFormContentProps> = ({
  isSubmitting = false,
}) => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Student Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CNTextInputField
          label="First Name"
          name="name.first"
          placeholder="e.g. Rahul"
          required
        />
        <CNTextInputField
          label="Middle Name"
          name="name.middle"
          placeholder="e.g. Kumar"
          required
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
          placeholder="e.g. rahul@example.com"
          required
        />
        <CNTextInputField
          label="Age"
          name="age"
          type="number"
          placeholder="e.g. 16"
          required
        />

        <CNCheckboxField
          label="Active Profile"
          name="isActive"
          description="Enable student profile"
        />
      </CardContent>
    </Card>

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
            Creating Student...
          </>
        ) : (
          'Create Student'
        )}
      </Button>
    </div>
  </div>
);

interface CreateStudentFormProps {
  initialValues: Partial<StudentFormValues>;
  onSubmit: (
    values: StudentFormValues,
    formikHelpers: FormikHelpers<StudentFormValues>
  ) => void | Promise<void>;
  isSubmitting?: boolean;
}

const CreateStudentForm: React.FC<CreateStudentFormProps> = ({
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
      <CreateStudentFormContent isSubmitting={isSubmitting} />
    </FormikForm>
  );
};

export default CreateStudentForm;
