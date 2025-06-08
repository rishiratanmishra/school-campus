import React from "react";
import { useField } from "formik";
import { cn } from "@/lib/utils";
import { Checkbox } from "../checkbox";

interface CNCheckboxFieldProps {
  label?: string;
  name: string;
  description?: string;
  containerClass?: string;
  labelClass?: string;
  errorClass?: string;
  disabled?: boolean;
}

export const CNCheckboxField: React.FC<CNCheckboxFieldProps> = ({
  label,
  description,
  containerClass,
  labelClass,
  errorClass,
  disabled = false,
  ...props
}) => {
  const [field, meta, helpers] = useField({ name: props.name, type: "checkbox" });

  return (
    <div className={cn("flex flex-col space-y-1", containerClass)}>
      <label
        htmlFor={props.name}
        className={cn(
          "inline-flex items-center cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          labelClass
        )}
      >
        <Checkbox
          id={props.name}
          {...field}
          {...props}
          checked={field.value}
          disabled={disabled}
          onCheckedChange={(checked) => {
            // Radix returns boolean | "indeterminate"
            if (checked === "indeterminate") return;
            helpers.setValue(Boolean(checked));
          }}
          className={cn("mr-2")}
        />
        {label}
      </label>

      {description && (
        <p className="text-sm text-muted-foreground ml-6">{description}</p>
      )}

      {meta.touched && meta.error ? (
        <p className={cn("text-sm text-destructive ml-6", errorClass)}>
          {meta.error}
        </p>
      ) : null}
    </div>
  );
};
