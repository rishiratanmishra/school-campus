'use client';

import * as React from 'react';
import { useField } from 'formik';
import { format } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

type CNDatePickerFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  className?: string;
};

export const CNDatePickerField: React.FC<CNDatePickerFieldProps> = ({
  name,
  label,
  placeholder = 'Select date',
  fromYear = 1950,
  toYear = new Date().getFullYear(),
  className,
}) => {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    helpers.setValue(date);
    setOpen(false);
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal bg-background text-foreground',
              !field.value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? format(field.value, 'dd MMM yyyy') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background text-foreground"
          align="start"
        >
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={field.value}
            onSelect={handleSelect}
            fromYear={fromYear}
            toYear={toYear}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};
