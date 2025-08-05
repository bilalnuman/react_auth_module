import React from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValue } from '../schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthForm from '../components/AuthForm';
import { useApi } from '../services/authService';

const LoginPage: React.FC = () => {
  const { request, loading } = useApi();
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (form: LoginFormValue) => {
    const { data, error } = await request({
      endpoint: '/api/login',
      data: form,
    });

    if (data) {
      console.log('Login success', data);
    } else {
      console.log('Login failed:', error);
    }
  };


  const fields = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm
        fields={fields}
        control={control}
        errors={errors}
        isSubmitting={loading}
        onSubmit={handleSubmit(onSubmit)}
        buttonText="Login"
        formHeader={<div className='text-center pb-3 text-lg uppercase'>login form</div>}
        formFooter={
          <>
            <div className='text-start -mt-2 italic text-sm'>
              Have already an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </div>
            <div className="text-end mb-3">
              <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">
                Forgot password?
              </a>
            </div>
          </>
        }
      />
    </div>
  );
};

export default LoginPage;
