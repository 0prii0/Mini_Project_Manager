'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterUserMutation, useLoginUserMutation } from '@/features/auth/authApi';
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute';
import { useToast } from '@/components/common/Toast';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const isLoading = isRegistering || isLoggingIn;

  const validate = () => {
    const errors: typeof clientErrors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    else if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errors.email = 'Please enter a valid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();
      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();
      showToast('Account created successfully! Welcome to Mini Project Manager.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <PublicOnlyRoute>
      <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative bg-[#F8FAFC]">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-7">
            {/* Logo Badge & Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#172554] text-white shadow-md shadow-blue-950/20 mb-1">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-heading text-[#0F172A] tracking-tight">
                  Create an account
                </h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Start organizing your projects and workflows
                </p>
              </div>
            </div>

            {apiError && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs shadow-sm animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 mt-0.5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">Registration failed</p>
                  <p className="mt-0.5 text-rose-700">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (clientErrors.name) setClientErrors({ ...clientErrors, name: undefined });
                    }}
                    placeholder="Priyanshu Kumar"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-all text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 ${
                      clientErrors.name
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10'
                    }`}
                  />
                </div>
                {clientErrors.name && (
                  <p className="text-xs text-rose-600 font-medium">{clientErrors.name}</p>
                )}
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (clientErrors.email) setClientErrors({ ...clientErrors, email: undefined });
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-all text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 ${
                      clientErrors.email
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10'
                    }`}
                  />
                </div>
                {clientErrors.email && (
                  <p className="text-xs text-rose-600 font-medium">{clientErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider"
                >
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (clientErrors.password) setClientErrors({ ...clientErrors, password: undefined });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-all text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 ${
                      clientErrors.password
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {clientErrors.password && (
                  <p className="text-xs text-rose-600 font-medium">{clientErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (clientErrors.confirmPassword)
                        setClientErrors({ ...clientErrors, confirmPassword: undefined });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-all text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 ${
                      clientErrors.confirmPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {clientErrors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-medium">{clientErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[10px] text-xs sm:text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Redirect */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-[#475569]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors underline-offset-2 hover:underline"
                >
                  Sign In instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}

export default SignupForm;
