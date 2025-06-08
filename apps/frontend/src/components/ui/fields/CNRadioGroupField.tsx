
import { useField } from "formik";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CNRadioGroupFieldProps {
  name: string;
  label?: string;
  options: Option[];
  required?: boolean;
  description?: string;
  containerClass?: string;
  labelClass?: string;
  descriptionClass?: string;
  errorClass?: string;
  itemClass?: string;
  className?: string;
}

export const CNRadioGroupField: React.FC<CNRadioGroupFieldProps> = ({
  name,
  label,
  options,
  required,
  description,
  containerClass,
  labelClass,
  descriptionClass,
  errorClass,
  itemClass,
  className,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={cn("space-y-1", containerClass)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "text-sm font-medium text-foreground",
            meta.touched && meta.error && "text-destructive",
            labelClass
          )}
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}

      {description && (
        <p className={cn("text-sm text-muted-foreground", descriptionClass)}>
          {description}
        </p>
      )}

      <RadioGroup
        id={name}
        name={name}
        value={field.value}
        onValueChange={(val) => helpers.setValue(val)}
        className={cn("grid gap-4", className)}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 text-sm"
          >
            <RadioGroupItem
              value={option.value}
              disabled={option.disabled}
              className={itemClass}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>

      {meta.touched && meta.error && (
        <p className={cn("text-sm text-destructive", errorClass)}>
          {meta.error}
        </p>
      )}
    </div>
  );
};
