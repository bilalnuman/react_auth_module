import React from 'react';

interface InputFieldProps {
    label: string;
    type?: string;
    error?: { message?: string };
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, name, type = 'text', error, value, onChange, onBlur, ...rest }, ref) => {
        return (
            <div className="mb-4">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <input
                    id={name}
                    type={type}
                    value={value ?? ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                    {...rest}
                />
                {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;
