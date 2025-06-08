import React, { useId } from 'react';
import { useField } from 'formik';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

interface CNSelectFieldOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface CNSelectFieldProps {
  label?: string;
  name: string;
  description?: string;
  options: CNSelectFieldOption[];
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CNSelectField: React.FC<CNSelectFieldProps> = ({
  label,
  name,
  description,
  options,
  required = false,
  containerClassName,
  labelClassName,
  errorClassName,
  descriptionClassName,
  placeholder = 'Select an option',
  disabled = false,
  className,
}) => {
  const [field, meta, helpers] = useField(name);
  const id = useId();

  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className={cn('space-y-1', containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium',
            showError ? 'text-destructive' : 'text-foreground',
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}

      {description && (
        <p
          id={`${id}-desc`}
          className={cn('text-xs text-muted-foreground', descriptionClassName)}
        >
          {description}
        </p>
      )}

      <Select
        name={name}
        value={field.value}
        onValueChange={(val) => helpers.setValue(val)}
        onBlur={() => helpers.setTouched(true)}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-describedby={
            description ? `${id}-desc` : showError ? `${id}-error` : undefined
          }
          aria-invalid={showError}
          className={cn(
            'w-full',
            showError ? 'border-destructive' : 'border-input',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map(({ value, label, disabled }) => (
            <SelectItem key={value} value={value} disabled={disabled}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showError && (
        <p
          id={`${id}-error`}
          className={cn('text-sm text-destructive mt-1', errorClassName)}
          role="alert"
        >
          {meta.error}
        </p>
      )}
    </div>
  );
};
