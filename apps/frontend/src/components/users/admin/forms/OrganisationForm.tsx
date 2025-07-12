import React from 'react';
import { FormikHelpers, useFormikContext, FieldArray } from 'formik';
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
  MapPin,
  Phone,
  Mail,
  Share2,
  Image,
  Quote,
  Plus,
  Trash2,
} from 'lucide-react';
import { generateSlug } from '@/components/helpers/helpers';

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

const CONTACT_TYPE_OPTIONS = [
  { value: 'PHONE', label: 'Phone' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'FAX', label: 'Fax' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'LANDLINE', label: 'Landline' },
];

const ADDRESS_TYPE_OPTIONS = [
  { value: 'MAIN', label: 'Main Address' },
  { value: 'BRANCH', label: 'Branch Address' },
  { value: 'BILLING', label: 'Billing Address' },
  { value: 'POSTAL', label: 'Postal Address' },
];

// Component to handle auto slug generation
const AutoSlugHandler: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<OrganisationFormValues>();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);

  React.useEffect(() => {
    // Only auto-generate slug if it hasn't been manually edited
    if (!slugManuallyEdited && values.name) {
      const generatedSlug = generateSlug(values.name);
      setFieldValue('slug', generatedSlug);
    }
  }, [values.name, slugManuallyEdited, setFieldValue]);

  // Handle manual slug editing
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFieldValue('slug', e.target.value);
  };

  return (
    <CNTextInputField
      label="Slug"
      name="slug"
      placeholder="e.g., my-school"
      onChange={handleSlugChange}
    />
  );
};

// Address Field Array Component
const AddressFieldArray: React.FC = () => {
  const { values } = useFormikContext<OrganisationFormValues>();

  return (
    <FieldArray name="address">
      {({ push, remove }) => (
        <div className="space-y-4">
          {values.address?.map((address, index) => (
            <div key={index} className="border rounded-lg p-4 bg-muted/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Address {index + 1}</h4>
                {values.address && values.address.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <CNSelectField
                  label="Address Type"
                  name={`address.${index}.type`}
                  placeholder="Select address type"
                  options={ADDRESS_TYPE_OPTIONS}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CNTextInputField
                    label="Street Address"
                    name={`address.${index}.street`}
                    placeholder="Enter street address"
                  />
                  <CNTextInputField
                    label="Area/Locality"
                    name={`address.${index}.area`}
                    placeholder="Enter area or locality"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CNTextInputField
                    label="City"
                    name={`address.${index}.city`}
                    placeholder="Enter city"
                  />
                  <CNTextInputField
                    label="State"
                    name={`address.${index}.state`}
                    placeholder="Enter state"
                  />
                  <CNTextInputField
                    label="Pincode"
                    name={`address.${index}.pincode`}
                    placeholder="Enter pincode"
                  />
                </div>

                <CNTextInputField
                  label="Country"
                  name={`address.${index}.country`}
                  placeholder="Enter country"
                />

                <CNCheckboxField
                  label="Primary Address"
                  name={`address.${index}.isPrimary`}
                  description="Mark this as the primary address"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              push({
                type: 'MAIN',
                street: '',
                area: '',
                city: '',
                state: '',
                pincode: '',
                country: '',
                isPrimary: false,
              })
            }
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Address
          </Button>
        </div>
      )}
    </FieldArray>
  );
};

// Contact Information Field Array Component
const ContactFieldArray: React.FC = () => {
  const { values } = useFormikContext<OrganisationFormValues>();

  return (
    <FieldArray name="contactInfo">
      {({ push, remove }) => (
        <div className="space-y-4">
          {values.contactInfo?.map((contact, index) => (
            <div key={index} className="border rounded-lg p-4 bg-muted/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Contact {index + 1}</h4>
                {values.contactInfo && values.contactInfo.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CNSelectField
                    label="Contact Type"
                    name={`contactInfo.${index}.type`}
                    placeholder="Select contact type"
                    options={CONTACT_TYPE_OPTIONS}
                  />
                  <CNTextInputField
                    label="Label"
                    name={`contactInfo.${index}.label`}
                    placeholder="e.g., Main Office, Admissions"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CNTextInputField
                    label="Contact Value"
                    name={`contactInfo.${index}.value`}
                    placeholder="Enter phone number or email"
                  />
                  <CNTextInputField
                    label="Extension"
                    name={`contactInfo.${index}.extension`}
                    placeholder="e.g., ext 123"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CNCheckboxField
                    label="Primary Contact"
                    name={`contactInfo.${index}.isPrimary`}
                    description="Mark this as primary contact"
                  />
                  <CNCheckboxField
                    label="Public Contact"
                    name={`contactInfo.${index}.isPublic`}
                    description="Show this contact publicly"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              push({
                type: 'PHONE',
                label: '',
                value: '',
                extension: '',
                isPrimary: false,
                isPublic: true,
              })
            }
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Contact
          </Button>
        </div>
      )}
    </FieldArray>
  );
};

interface OrganisationFormContentProps {
  isSubmitting?: boolean;
}

const OrganisationFormContent: React.FC<OrganisationFormContentProps> = ({
  isSubmitting = false,
}) => (
  <div className="space-y-6">
    {/* Basic Information Section */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CNTextInputField
            label="Organisation Name"
            name="name"
            placeholder="Enter organisation name"
            required
          />
          <AutoSlugHandler />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            required
            placeholder="Select board"
            options={BOARD_TYPE_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CNTextInputField
            label="Website Domain"
            name="domain"
            placeholder="e.g., example.com"
          />
          <CNDatePickerField
            label="Established Date"
            name="established"
            placeholder="Select establishment date"
          />
        </div>

        <CNTextInputField
          label="Motto"
          name="motto"
          placeholder="Organization motto or tagline"
        />
      </CardContent>
    </Card>

    {/* Visual Identity Section */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Visual Identity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CNTextInputField
            label="Logo URL"
            name="logo"
            placeholder="https://example.com/logo.png"
          />
          <CNTextInputField
            label="Cover Image URL"
            name="coverImage"
            placeholder="https://example.com/cover.jpg"
          />
        </div>
      </CardContent>
    </Card>

    {/* Description Section */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          About the Organisation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CNTextAreaField
          label="Description"
          name="description"
          rows={6}
          placeholder="Detailed description of the organisation, its mission, vision, and key features..."
          description="This will be displayed on the organization's profile page"
        />
      </CardContent>
    </Card>

    {/* Address Section with FieldArray */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AddressFieldArray />
      </CardContent>
    </Card>

    {/* Contact Information Section with FieldArray */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ContactFieldArray />
      </CardContent>
    </Card>

    {/* Social Media Section */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Social Media Presence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CNTextInputField
            label="Facebook"
            name="socialMedia.facebook"
            placeholder="https://facebook.com/yourorganization"
          />
          <CNTextInputField
            label="Instagram"
            name="socialMedia.instagram"
            placeholder="https://instagram.com/yourorganization"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CNTextInputField
            label="Twitter"
            name="socialMedia.twitter"
            placeholder="https://twitter.com/yourorganization"
          />
          <CNTextInputField
            label="LinkedIn"
            name="socialMedia.linkedin"
            placeholder="https://linkedin.com/company/yourorganization"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CNTextInputField
            label="YouTube"
            name="socialMedia.youtube"
            placeholder="https://youtube.com/c/yourorganization"
          />
          <CNTextInputField
            label="Website"
            name="socialMedia.website"
            placeholder="https://yourorganization.com"
          />
        </div>
      </CardContent>
    </Card>

    {/* Status Section */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Status & Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CNCheckboxField
          label="Active Organisation"
          name="isActive"
          description="Enable this organisation for operations and make it visible to users"
        />
      </CardContent>
    </Card>

    {/* Submit Button */}
    <div className="sticky bottom-0 bg-background pt-6 pb-4 border-t">
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
      <OrganisationFormContent isSubmitting={isSubmitting} />
    </FormikForm>
  );
};

export default OrganisationForm;
