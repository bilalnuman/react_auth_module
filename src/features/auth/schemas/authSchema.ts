import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
    email: z
        .string("Email is required")
        .email('Invalid email address')
        .nonempty('Email is required'),
    password: z
        .string("Password is requred")
        .min(8, 'Password must be at least 8 characters')
        .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export type LoginFormValue = z.infer<typeof loginSchema>;


export const registerSchema = z
    .object({
        name: z
            .string("Name is required")
            .min(2, 'Name must be at least 2 characters long')
            .max(50, 'Name must be less than 50 characters long'),
        email: z
            .string("Email is required")
            .email('Invalid email address')
            .nonempty('Email is required'),
        password: z
            .string('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        confirmPassword: z
            .string('Confirm password is required')
            .min(8, 'Confirm Password must be at least 8 characters')
            .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                path: ['confirmPassword'],
                message: 'Passwords do not match',
                code: z.ZodIssueCode.custom,
            });
        }
    });



export type RegisterFormValue = z.infer<typeof registerSchema>;


export const forgotSchema = z.object({
    email: z
        .string("Email is required")
        .email('Invalid email address')
        .nonempty('Email is required'),
});

export type ForgotFormValue = z.infer<typeof forgotSchema>;

export const resetSchema = z.object({
    password: z
        .string('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z
        .string('Confirm password is required')
        .min(8, 'Confirm Password must be at least 8 characters')
        .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            path: ['confirmPassword'],
            message: 'Passwords do not match',
            code: z.ZodIssueCode.custom,
        });
    }
});

export type ResetFormValue = z.infer<typeof resetSchema>;

export const otpSchema = z.object({
    otp: z
        .array(z.string().regex(/^\d$/, 'Each digit must be a number'))
        .length(6, 'OTP must be 6 digits long'),
});

export type OtpFormValue = z.infer<typeof otpSchema>;
