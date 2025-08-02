import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

export const useAuthForm = <T extends FieldValues>(schema: ZodType<any, any, any>, onSubmitHandler: SubmitHandler<T>) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: T) => {
    await onSubmitHandler(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    control,
    isSubmitting,
    onSubmit,
  };
};
