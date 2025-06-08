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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  <div className="space-y-6 sm:space-y-8">
    {/* Basic Information Section */}
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Building2 className="h-4 w-4" />
        Basic Information
      </div>
      <div className="space-y-3 sm:space-y-4 pl-4 sm:pl-6">
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
          description="URL-friendly identifier for the organisation"
        />
      </div>
    </div>

    <Separator />

    {/* Online Presence Section */}
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Globe className="h-4 w-4" />
        Online Presence
      </div>
      <div className="space-y-3 sm:space-y-4 pl-4 sm:pl-6">
        <CNTextInputField
          label="Website Domain"
          name="domain"
          placeholder="e.g., example.com"
        />
        <CNDatePickerField
          label="Established Date"
          name="established"
          description="When was the organisation founded?"
        />
      </div>
    </div>

    <Separator />

    {/* Description Section */}
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <FileText className="h-4 w-4" />
        Description
      </div>
      <div className="pl-4 sm:pl-6">
        <CNTextAreaField
          label="About the Organisation"
          name="description"
          rows={4}
          placeholder="Brief description of the organisation, its mission, and key features..."
          description="This helps identify the organisation's purpose and scope"
        />
      </div>
    </div>

    <Separator />

    {/* Classification Section */}
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <GraduationCap className="h-4 w-4" />
        Classification
      </div>
      <div className="space-y-3 sm:space-y-4 pl-4 sm:pl-6">
        <CNSelectField
          label="Organisation Type"
          name="organisationType"
          required
          placeholder="Select organisation type"
          options={ORGANISATION_TYPE_OPTIONS}
          description="Primary category of educational institution"
        />
        <CNSelectField
          label="Board/Curriculum Type"
          name="boardType"
          placeholder="Select board type"
          options={BOARD_TYPE_OPTIONS}
          description="Educational board or curriculum followed"
        />
      </div>
    </div>

    <Separator />

    {/* Status Section */}
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Award className="h-4 w-4" />
        Status
      </div>
      <div className="pl-4 sm:pl-6">
        <CNCheckboxField
          label="Active Organisation"
          name="isActive"
          description="Enable this organisation for operations"
        />
      </div>
    </div>

    <Separator />

    {/* Submit Section */}
    <div className="sticky -bottom-10 bg-background border-t mt-2">
      <div className="py-4">
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
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
        <p className="text-xs text-muted-foreground mt-2 text-center">
          By creating this organisation, you confirm that all information
          provided is accurate.
        </p>
      </div>
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
