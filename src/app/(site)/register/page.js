'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/context/AuthContext';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      router.push('/verify-otp');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Join the Family</p>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Register to checkout faster and track your orders.</p>

        {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="auth-label" htmlFor="register-firstName">First Name</label>
          <input
            id="register-firstName"
            className="auth-input"
            type="text"
            placeholder="Your first name"
            {...register('firstName', {
              required: 'First name is required',
              minLength: { value: 2, message: 'First name must be at least 2 characters' },
            })}
          />
          {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}

          <label className="auth-label" htmlFor="register-lastName">Last Name</label>
          <input
            id="register-lastName"
            className="auth-input"
            type="text"
            placeholder="Your last name"
            {...register('lastName', {
              required: 'Last name is required',
              minLength: { value: 2, message: 'Last name must be at least 2 characters' },
            })}
          />
          {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}

          <label className="auth-label" htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
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

          <label className="auth-label" htmlFor="register-phone">Phone Number</label>
          <input
            id="register-phone"
            className="auth-input"
            type="tel"
            placeholder="+44 7xxx xxxxxx"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?\d{7,15}$/,
                message: 'Enter a valid phone number',
              },
            })}
          />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}

          <label className="auth-label" htmlFor="register-password">Password</label>
          <input
            id="register-password"
            className="auth-input"
            type="password"
            placeholder="Create a password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}

          <label className="auth-label" htmlFor="register-confirmPassword">Confirm Password</label>
          <input
            id="register-confirmPassword"
            className="auth-input"
            type="password"
            placeholder="Re-enter password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/login">Already have an account? Login</Link>
        </div>
      </div>
    </section>
  );
}