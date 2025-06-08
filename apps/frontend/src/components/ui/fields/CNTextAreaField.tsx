import React, { useMemo } from "react";
import { useField } from "formik";
import { Textarea } from "../textarea";
import { cn } from "@/lib/utils";

interface CNTextAreaFieldProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  name: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const CNTextAreaField: React.FC<CNTextAreaFieldProps> = ({
  label,
  description,
  containerClassName,
  labelClassName,
  errorClassName,
  descriptionClassName,
  showCharacterCount = false,
  maxLength,
  className,
  id,
  required,
  ...props
}) => {
  const [field, meta] = useField(props.name);

  // Compute remaining characters only if maxLength provided
  const remainingChars = useMemo(() => {
    if (maxLength == null) return null;
    return maxLength - (field.value?.length ?? 0);
  }, [maxLength, field.value]);

  const fieldId = id || props.name;

  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            "block text-sm font-medium",
            meta.touched && meta.error ? "text-destructive" : "text-foreground",
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}

      {description && (
        <p className={cn("text-xs text-muted-foreground", descriptionClassName)}>
          {description}
        </p>
      )}

      <div className="relative">
        <Textarea
          {...field}
          {...props}
          id={fieldId}
          maxLength={maxLength}
          required={required}
          aria-invalid={meta.touched && !!meta.error}
          aria-describedby={
            description ? `${fieldId}-desc` : meta.touched && meta.error ? `${fieldId}-error` : undefined
          }
          className={cn(
            "min-h-[80px] resize-y border",
            meta.touched && meta.error ? "border-destructive" : "border-input",
            className
          )}
        />

        {showCharacterCount && maxLength != null && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1 rounded select-none pointer-events-none">
            {remainingChars}/{maxLength}
          </div>
        )}
      </div>

      {meta.touched && meta.error && (
        <p id={`${fieldId}-error`} className={cn("text-sm text-destructive mt-1", errorClassName)}>
          {meta.error}
        </p>
      )}
    </div>
  );
};
