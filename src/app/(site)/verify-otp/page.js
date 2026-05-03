'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function VerifyOtpPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    console.log('OTP verification', data);
    // TODO: Verify OTP and update password via backend endpoint.
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Security Check</p>
        <h1 className="auth-title">OTP Verification</h1>
        <p className="auth-subtitle">Use the code sent to your email to reset your password.</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="auth-label" htmlFor="verify-email">Email Address</label>
          <input
            id="verify-email"
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}

          <label className="auth-label" htmlFor="verify-otp">OTP Code</label>
          <input
            id="verify-otp"
            className="auth-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            {...register('otp', {
              required: 'OTP code is required',
              minLength: { value: 6, message: 'OTP must be 6 digits' },
              maxLength: { value: 6, message: 'OTP must be 6 digits' },
            })}
          />
          {errors.otp && <p className="form-error">{errors.otp.message}</p>}

          <label className="auth-label" htmlFor="verify-password">New Password</label>
          <input
            id="verify-password"
            className="auth-input"
            type="password"
            placeholder="Enter new password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          {errors.newPassword && <p className="form-error">{errors.newPassword.message}</p>}

          <label className="auth-label" htmlFor="verify-confirm-password">Confirm Password</label>
          <input
            id="verify-confirm-password"
            className="auth-input"
            type="password"
            placeholder="Re-enter new password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === getValues('newPassword') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}

          <button type="submit" className="auth-submit">Verify and Reset Password</button>
        </form>

        <div className="auth-links">
          <Link href="/forgot-password">Resend code</Link>
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}
