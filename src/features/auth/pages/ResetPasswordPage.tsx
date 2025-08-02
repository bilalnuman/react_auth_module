import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthForm from '../components/AuthForm';
import { resetSchema, type ResetFormValue } from '../schemas/authSchema';

const ResetPasswordPage: React.FC = () => {
  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValue) => {
  
  };

  const fields = [
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm
        fields={fields}
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        buttonText="Reset"
        formHeader={<div className='text-center pb-3 text-lg uppercase'>reset password</div>}
      />
    </div>
  );
};

export default ResetPasswordPage;
