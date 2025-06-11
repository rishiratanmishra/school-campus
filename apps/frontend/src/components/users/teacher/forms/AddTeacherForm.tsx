'use client';

import React from 'react';
import CreateTeacherForm from './CreateTeacherForm';
import { toast } from 'sonner';
import { FormikHelpers } from 'formik';
import { ITeacherZS } from 'api-definitions/features/teacher/teacher.zod';
import { useCreateTeacher } from '@/service/TeacherService';

const AddTeacherForm = ({ onFormSubmit }: { onFormSubmit?: () => void }) => {
  const createTeacher = useCreateTeacher();

  const initialValues: ITeacherZS = {
    name: {
      first: '',
      last: '',
      middle: '',
    },
    email: '',
    phoneNumber: '',
    qualification: '',
    department: '',
    subjects: [],
    isActive: true,
  };

  const handleSubmit = async (
    values: ITeacherZS,
    { resetForm }: FormikHelpers<ITeacherZS>
  ) => {
    try {
      const result = await createTeacher.mutateAsync(values);
      if (result) {
        toast.success('Teacher created successfully', {
          description: 'The teacher has been added to the system.',
        });

        resetForm();

        if (onFormSubmit) {
          onFormSubmit();
        }
      }
    } catch (error) {
      console.error('Failed to create teacher', error);
      toast.error('Error creating teacher', {
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <CreateTeacherForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={createTeacher.isPending}
    />
  );
};

export default AddTeacherForm;
