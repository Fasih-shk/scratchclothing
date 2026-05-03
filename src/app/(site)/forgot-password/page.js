'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/context/AuthContext';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    try {
      setError('');
      const result = await forgotPassword(data.email);
      if (result.success) {
        setSuccess('If an account exists, a reset link will be sent');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Password Recovery</p>
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">Enter your email and we will send a reset link.</p>

        {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="form-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="auth-label" htmlFor="forgot-email">Email Address</label>
          <input
            id="forgot-email"
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

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}