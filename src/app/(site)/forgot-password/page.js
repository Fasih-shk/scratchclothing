'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = (data) => {
    console.log('Forgot password request', data);
    // TODO: Send reset code using backend endpoint.
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Password Recovery</p>
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">Enter your email and we will send a one-time verification code.</p>

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

          <button type="submit" className="auth-submit">Send Verification Code</button>
        </form>

        <div className="auth-links">
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}
