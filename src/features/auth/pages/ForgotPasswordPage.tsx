import React from 'react';
import { useForm } from 'react-hook-form';
import { forgotSchema, type ForgotFormValue } from '../schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthForm from '../components/AuthForm';

const ForgotPasswordPage: React.FC = () => {
  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValue) => {
  };

  const fields = [
    { name: 'email', label: 'Email', type: 'email' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm
        fields={fields}
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        buttonText="Submit"
        formHeader={<div className='text-center pb-3 text-lg uppercase'>Forgot password</div>}
      />
    </div>
  );
};

export default ForgotPasswordPage;
