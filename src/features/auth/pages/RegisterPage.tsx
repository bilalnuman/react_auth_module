import React from 'react';
import { registerSchema, type RegisterFormValue } from '../schemas/authSchema';
import { useAuthForm } from '../hooks/useAuthForm';
import AuthForm from '../components/AuthForm';

const RegisterPage: React.FC = () => {
    const { handleSubmit, errors, control, isSubmitting, onSubmit } = useAuthForm(registerSchema, async (data: RegisterFormValue) => {
    });

    const fields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
    ];



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <AuthForm
                control={control}
                fields={fields}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
                buttonText="Register"
                formHeader={<div className='text-center pb-3 text-lg uppercase'>registeration form</div>}
            />
        </div>
    );
};

export default RegisterPage;
