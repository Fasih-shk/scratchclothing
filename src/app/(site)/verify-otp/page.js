'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/context/AuthContext';
import { useState } from 'react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { user, verifyOTP, resendOTP, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await verifyOTP(data.otp);
      setSuccess('Email verified successfully!');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    try {
      setResending(true);
      await resendOTP(user.email);
      setSuccess('OTP sent to your email');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Security Check</p>
        <h1 className="auth-title">Verify Your Email</h1>
        <p className="auth-subtitle">Enter the 6-digit code sent to your email.</p>

        {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="form-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" onClick={handleResend} disabled={resending}>
            {resending ? 'Sending...' : 'Resend code'}
          </button>
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}