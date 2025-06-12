import React from 'react';
import { FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { FormikForm } from '@/components/ui/data-entry/FormikForm';
import {
  CNCheckboxField,
  CNDatePickerField,
  CNSelectField,
  CNTextAreaField,
  CNTextInputField,
} from '@/components/ui/fields';
import { validateZodSchemaFormik } from '@/components/ui/data-entry/ZodHelper';
import OrganisationZodSchema, {
  IOrganisationZS,
} from 'api-definitions/features/organisation/organisation.zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  Globe,
  Calendar,
  FileText,
  GraduationCap,
  Award,
} from 'lucide-react';

export type OrganisationFormValues = IOrganisationZS;

const validateForm = (values: IOrganisationZS) => {
  return validateZodSchemaFormik({
    schema: OrganisationZodSchema,
    values,
  });
};

const ORGANISATION_TYPE_OPTIONS = [
  { value: 'SCHOOL', label: 'School' },
  { value: 'COLLEGE', label: 'College' },
  { value: 'UNIVERSITY', label: 'University' },
  { value: 'TRAINING_INSTITUTE', label: 'Training Institute' },
  { value: 'COACHING', label: 'Coaching' },
  { value: 'OTHER', label: 'Other' },
];

const BOARD_TYPE_OPTIONS = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'STATE', label: 'State Board' },
  { value: 'INTERNATIONAL', label: 'International' },
  { value: 'OTHER', label: 'Other' },
];

interface OrganisationFormContentProps {
  isSubmitting?: boolean;
}

const OrganisationFormContent: React.FC<OrganisationFormContentProps> = ({
  isSubmitting = false,
}) => (
  <div className="space-y-3">
    {/* Basic Information Card */}

    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CNTextInputField
        label="Organisation Name"
        name="name"
        placeholder="Enter organisation name"
        required
      />
      <CNTextInputField
        label="Slug"
        name="slug"
        placeholder="e.g., my-school"
      />
    </CardContent>

    {/* Online Presence Card */}

    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CNTextInputField
        label="Website Domain"
        name="domain"
        placeholder="e.g., example.com"
      />
      <CNDatePickerField label="Established Date" name="established" />
    </CardContent>

    {/* Description Card */}

    <CardContent>
      <CNTextAreaField
        label="About the Organisation"
        name="description"
        rows={4}
        placeholder="Brief description of the organisation..."
        description="Mission, vision, and key features"
      />
    </CardContent>

    {/* Classification Card */}

    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CNSelectField
        label="Organisation Type"
        name="organisationType"
        required
        placeholder="Select type"
        options={ORGANISATION_TYPE_OPTIONS}
      />
      <CNSelectField
        label="Board/Curriculum"
        name="boardType"
        placeholder="Select board"
        options={BOARD_TYPE_OPTIONS}
      />
    </CardContent>

    {/* Status Card */}

    <CardContent>
      <CNCheckboxField
        label="Active Organisation"
        name="isActive"
        description="Enable this organisation for operations"
      />
    </CardContent>

    {/* Submit Button */}
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
            Creating Organisation...
          </>
        ) : (
          'Create Organisation'
        )}
      </Button>
    </div>
  </div>
);

interface OrganisationFormProps {
  initialValues?: Partial<OrganisationFormValues>;
  onSubmit: (
    values: OrganisationFormValues,
    formikHelpers: FormikHelpers<OrganisationFormValues>
  ) => void | Promise<void>;
  isSubmitting?: boolean;
}

const OrganisationForm: React.FC<OrganisationFormProps> = ({
  initialValues = {},
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
      <OrganisationFormContent isSubmitting={isSubmitting} />
    </FormikForm>
  );
};

export default OrganisationForm;
