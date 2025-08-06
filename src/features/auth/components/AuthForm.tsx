import React, { type ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import InputField from './InputField';

export type fieldsType = {
  name: string; label: string; type: string, icon?: ReactNode;
  iconPosition?: "left" | "right";
  placeholder?: string
}
interface AuthFormProps {
  fields: fieldsType[];
  errors: any;
  isSubmitting: boolean;
  control: any;
  onSubmit: () => void;
  buttonText: string;
  formHeader?: ReactNode
  formFooter?: ReactNode,
  enablePasswordToggle?: boolean,
}

const AuthForm: React.FC<AuthFormProps> = ({ fields, errors, isSubmitting, onSubmit, formHeader, formFooter, buttonText, control }) => {
 
  return (
    <div className=' max-w-md bg-white p-6 rounded shadow-md w-full'>
      {formHeader && formHeader}
      <form onSubmit={onSubmit} className="">
        {fields.map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: controllerField }) => (
              <InputField
                fieldMeta={field}
                {...controllerField}
                enablePasswordToggle={field.type === "password" ? true : false}
                label={field.label}
                type={field.type}
                error={errors[field.name]}
                icon={field?.icon}
                iconPosition={field?.iconPosition}

              />
            )}
          />
        ))}
        {formFooter && formFooter}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Loading" : buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
