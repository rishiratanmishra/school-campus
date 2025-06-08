"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useField } from "formik"; 
import { format } from "date-fns";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface CNDatePickerFieldProps {
  label?: string;
  name: string;
  description?: string;
  containerClass?: string;
  labelClass?: string;
  errorClass?: string;
  descriptionClass?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const CNDatePickerField: React.FC<CNDatePickerFieldProps> = ({
  label,
  name,
  description,
  containerClass,
  labelClass,
  errorClass,
  descriptionClass,
  required = false,
  disabled = false,
  minDate,
  maxDate,
}) => {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    field.value ? new Date(field.value) : undefined
  );

  useEffect(() => {
    if (field.value) {
      setSelectedDate(new Date(field.value));
    }
  }, [field.value]);

  const formattedDate = selectedDate ? format(selectedDate, "PPP") : "Select date";

  const onSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    helpers.setValue(date ? date.toISOString() : "");
    setOpen(false);
  };

  return (
    <div className={cn("space-y-1", containerClass)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium text-foreground",
            meta.touched && meta.error ? "text-destructive" : "",
            labelClass
          )}
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}

      {description && (
        <p className={cn("text-sm text-muted-foreground", descriptionClass)}>{description}</p>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            {formattedDate}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={(date) => 
              (minDate && date < minDate) || (maxDate && date > maxDate) ? true : false
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {meta.touched && meta.error && (
        <p className={cn("text-sm text-destructive", errorClass)}>{meta.error}</p>
      )}
    </div>
  );
};

export default CNDatePickerField;
