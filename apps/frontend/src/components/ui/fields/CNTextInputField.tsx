import { useField } from "formik";
import { Input } from "../input";

interface CNTextInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}

export const CNTextInputField: React.FC<CNTextInputFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id || props.name} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Input {...field} {...props} />
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
};