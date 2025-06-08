import _update from 'lodash/update';
import _get from 'lodash/get';

/**
 * Set value to a nested or a normal path in given obj. Returns new object.
 * @param obj - Any object.
 * @param path - Path where we need to place the value, can also be a deep nested path.
 * @param value - The actual value which will be place to the path.
 */
export const setValueAtPathInObj = ({ obj, path, value }: { obj: any; path: string; value: any }) => {
    return _update(obj, path, () => value);
};


/**
 * get value from a nested or a normal path in given obj. Returns value.
 * @param obj - Any object.
 * @param path - Path from where we need to get the value, can also be a deep nested path.
 */
export const getValueAtPathInObj = ({ obj, path }: { obj: any; path: string }) => {
    return _get(obj, path);
};

/**
 * Validate values as per given zod schema
 * @param schema
 * @param data
 */
export const validateZodSchema = ({ schema, data }: { schema: any; data: any }) => {
    const errors = schema?.safeParse(data);
    console.log('=>(index.ts:3) errors', errors);
    return errors;
};

/**
 * Convert a zod errors object to formik supported key:"error" type object.
 * @param zodErrors
 */
export const zodErrorsToFormikErrorsObj = (zodErrors: any) => {
    const errors = {};
    const issues = zodErrors?.error?.issues ?? [];
    issues.forEach((issue: any) => {
        const paths = issue?.path ?? [];
        const path = paths.join('.');
        setValueAtPathInObj({
            obj: errors,
            path,
            value: issue.message,
        });
    });
    return errors;
};

/**
 * Validates values using zod schema and formats errors in formik supported structure.
 * @param schema
 * @param values
 */
export const validateZodSchemaFormik = ({ schema, values }: { schema: any; values: any }) => {
    const zodErrors = validateZodSchema({
        schema,
        data: values,
    });
    return zodErrorsToFormikErrorsObj(zodErrors);
};
