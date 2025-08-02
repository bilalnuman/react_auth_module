import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OtpFormValue } from '../schemas/authSchema';

const OtpPage: React.FC = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValue>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ['', '', '', '', '', ''],
    },
  });

  const onSubmit = async (data: OtpFormValue) => {
    const code = data.otp.join('');
   
  };

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (input) input.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      pasteData.split('').forEach((digit, idx) => {
        setValue(`otp.${idx}`, digit);
      });
      focusInput(5);
      e.preventDefault();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    fieldOnChange: (val: string) => void
  ) => {
    const key = e.key;

    if (key === 'Backspace') {
      const currentValue = getValues(`otp.${index}`);
      if (!currentValue && index > 0) {
        setValue(`otp.${index - 1}`, '');
        focusInput(index - 1);
        e.preventDefault();
      }
    }

    if (key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
      e.preventDefault();
    }

    if (key === 'ArrowRight' && index < 5) {
      focusInput(index + 1);
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-sm"
      >
        <div className="text-center mb-4 text-lg font-semibold uppercase">OTP Form</div>

        <div className="flex justify-between gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Controller
              key={index}
              name={`otp.${index}`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                    field.ref(el);
                  }}

                  className={`w-10 h-10 text-center border text-xl rounded-md focus:outline-none focus:ring-2 ${errors.otp?.[index]
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, '');
                    if (val) {
                      field.onChange(val);
                      if (index < 5) focusInput(index + 1);
                    } else {
                      field.onChange('');
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, field.onChange)}
                  onPaste={handlePaste}
                />
              )}
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-center text-sm text-red-500">Otp is required and each must be digit</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mt-4"
        >
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default OtpPage;
