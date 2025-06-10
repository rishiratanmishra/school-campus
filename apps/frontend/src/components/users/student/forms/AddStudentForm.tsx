import React from 'react';
import CreateStudentForm from './CreateStudentForm';
import { toast } from 'sonner';
import { FormikHelpers } from 'formik';
import { IStudentZS } from 'api-definitions/features/student/student.zod';
import { useCreateStudent } from '@/service/StudentService';

const AddStudentForm = ({ onFormSubmit }: { onFormSubmit?: () => void }) => {
  const createStudent = useCreateStudent();
  const initialValues: IStudentZS = {
    name: {
      first: '',
      last: '',
      middle: '',
    },
    email: '',
    age: 16,
    isActive: true,
  };

  const handleSubmit = async (
    values: IStudentZS,
    { resetForm }: FormikHelpers<IStudentZS>
  ) => {
    try {
      const result = await createStudent.mutateAsync(values);
      if (result) {
        toast.success('Student created successfully', {
          description: 'The student has been added to the system.',
        });

        resetForm();

        if (onFormSubmit) {
          onFormSubmit();
        }
      }
    } catch (error) {
      console.error('Failed to create student', error);
      toast.error('Error creating student', {
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <CreateStudentForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={createStudent.isPending}
    />
  );
};

export default AddStudentForm;
