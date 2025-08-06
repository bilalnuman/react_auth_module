import React, { useState, type ReactNode } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

interface InputFieldProps {
    label: string;
    type?: string;
    error?: { message?: string };
    value?: string;
    enablePasswordToggle: boolean,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    [key: string]: any;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    fieldMeta: any
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, name, type = 'text', error, value, onChange, onBlur, icon, fieldMeta, iconPosition = "right", enablePasswordToggle = false, ...rest }, ref) => {

        const [secure, setSecure] = useState<boolean>(false);
        return (
            <div className="mb-4">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <div className='relative'>
                    <span className={`absolute top-1/2 -translate-y-1/2 z-10 ${iconPosition === 'left' ? "start-3" : "end-3"}`}>{icon}</span>
                    <input
                        {...fieldMeta}
                        id={name}
                        type={secure ? 'text' : type}
                        value={value ?? ""}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        placeholder={rest?.placeholder}
                        className={`${iconPosition === 'left' ? "ps-8" : ""} w-full px-3 py-2 border rounded-md focus:outline-none relative focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                            }`}
                        {...rest}

                    />
                    {enablePasswordToggle &&
                        <button type='button' onClick={() => setSecure(!secure)} className=' absolute end-3 top-1/2 -translate-y-1/2'>
                            {secure ? <FaRegEyeSlash className='text-lg text-gray-700' /> : <FaRegEye className='text-lg text-gray-700' />}
                        </button>}
                </div>
                {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;
