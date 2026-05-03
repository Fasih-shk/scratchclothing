'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }
    try {
      setError('');
      await resetPassword(token, data.newPassword);
      setSuccess('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Reset Password</p>
        <h1 className="auth-title">Create New Password</h1>
        <p className="auth-subtitle">Enter your new password below.</p>

        {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="form-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="auth-label" htmlFor="reset-password">New Password</label>
          <input
            id="reset-password"
            className="auth-input"
            type="password"
            placeholder="Enter new password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.newPassword && <p className="form-error">{errors.newPassword.message}</p>}

          <label className="auth-label" htmlFor="reset-confirm-password">Confirm Password</label>
          <input
            id="reset-confirm-password"
            className="auth-input"
            type="password"
            placeholder="Re-enter new password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === getValues('newPassword') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}

          <button type="submit" className="auth-submit" disabled={isLoading || !token}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}