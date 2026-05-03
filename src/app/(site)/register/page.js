'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Register data', data);
    // TODO: Integrate with backend register API.
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Join the Family</p>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Register to checkout faster and track your orders.</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="auth-label" htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            className="auth-input"
            type="text"
            placeholder="Your full name"
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Full name must be at least 2 characters' },
            })}
          />
          {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}

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
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}

          <label className="auth-label" htmlFor="register-confirm-password">Confirm Password</label>
          <input
            id="register-confirm-password"
            className="auth-input"
            type="password"
            placeholder="Re-enter password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}

          <button type="submit" className="auth-submit">Create Account</button>
        </form>

        <div className="auth-links">
          <Link href="/login">Already have an account? Login</Link>
          <Link href="/verify-otp">Verify OTP</Link>
        </div>
      </div>
    </section>
  );
}
