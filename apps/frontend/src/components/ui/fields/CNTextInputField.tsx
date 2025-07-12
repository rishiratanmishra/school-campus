import { useField } from 'formik';
import { Input } from '../input';
import { AnimatePresence, motion } from 'framer-motion';

interface CNTextInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}

export const CNTextInputField: React.FC<CNTextInputFieldProps> = ({
  label,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const showError = meta.touched && meta.error;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="text-sm font-medium text-card-foreground dark:text-card-foreground-dark"
        >
          {label}
        </label>
      )}

      <Input {...field} {...props} />

      <div className="min-h-[16px]">
        <AnimatePresence mode="wait" initial={false}>
          {showError && (
            <motion.p
              key="error"
              className="text-red-500 text-xs"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {meta.error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
