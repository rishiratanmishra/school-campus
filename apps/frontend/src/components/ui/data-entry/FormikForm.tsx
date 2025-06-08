import React from 'react';
import { Form, Formik, FormikConfig, FormikProps } from 'formik';

interface IFormProps extends FormikConfig<any> {
  children: React.ReactNode | ((formik: FormikProps<any>) => React.ReactNode);
}

export function FormikForm({ children, ...props }: IFormProps) {
  if (typeof children === 'function') {
    return (
      <Formik {...props}>
        {(formik: FormikProps<any>) => <Form>{children(formik)}</Form>}
      </Formik>
    );
  }

  return (
    <Formik {...props}>
      <Form style={{ height: '100%' }}>{children}</Form>
    </Formik>
  );
}
