import React from 'react';
import { registerSchema, type RegisterFormValue } from '../schemas/authSchema';
import { useAuthForm } from '../hooks/useAuthForm';
import AuthForm, { type fieldsType } from '../components/AuthForm';
import { useApi } from '../services/authService';
import { toast } from 'react-toastify';
import { formErrorToast } from '../../../util/formErrorToast';

const RegisterPage: React.FC = () => {
    const { request, loading } = useApi();
    const { handleSubmit, control, errors, onSubmit } = useAuthForm(registerSchema, async (data: RegisterFormValue) => {
        const { data: apiData, error } = await request({
            endpoint: 'auth/register',
            data: data,
            method: "POST"
        });
        if (apiData?.success) {
            toast.success(apiData?.message)
        } else {
            console.log(error)
            formErrorToast(error)
        }
    });


    const fields: fieldsType[] = [
        { name: 'name', label: 'Name', type: 'text', placeholder: "Enter your name" }, // if icon need use this syntex icon: <FaRegUser />,iconPosition:"left"
        { name: 'email', label: 'Email', type: 'email', placeholder: "Enter email" },
        { name: 'password', label: 'Password', type: 'password', placeholder: "Enter password" },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: "Enter confirm password" },
    ];



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <AuthForm
                control={control}
                fields={fields}
                errors={errors}
                isSubmitting={loading}
                onSubmit={handleSubmit(onSubmit)}
                buttonText="Register"
                formHeader={<div className='text-center pb-3 text-lg uppercase'>registeration form</div>}
                formFooter={
                    <div className='text-end -mt-2 mb-3 italic'>
                        Have already an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                    </div>
                }
            />
        </div>
    );
};

export default RegisterPage;
