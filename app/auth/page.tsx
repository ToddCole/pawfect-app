'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase-client';
import { z } from 'zod';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  // Helpers
  const cleanEmail = (value: string) => value.trim().toLowerCase();
  const emailSchema = z.string().min(6).max(254).email();
  const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    // Optional complexity; comment out if not desired
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Use letters and numbers');

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sanitize & validate inputs
      const normalizedEmail = cleanEmail(email);
      const emailParsed = emailSchema.safeParse(normalizedEmail);
      if (!emailParsed.success) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!useMagicLink && isSignUp) {
        const passParsed = passwordSchema.safeParse(password);
        if (!passParsed.success) {
          setError(passParsed.error.issues[0]?.message || 'Invalid password');
          setLoading(false);
          return;
        }
      }

      let result;
      
      if (isSignUp) {
        console.log('🔥 Starting signup for:', normalizedEmail);
        result = await supabaseClient.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
              : undefined,
          },
        });
        console.log('✅ Signup result:', result);
      } else {
        result = await supabaseClient.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
      }

      if (result.error && !result.data?.user) {
        // Only throw error if no user was created
        throw result.error;
      }

      if (isSignUp) {
        if (result.data?.user) {
          const requiresEmailConfirm = !result.data.session; // if no session, confirmation is likely required
          if (requiresEmailConfirm) {
            setMessage('Account created! Please check your email to confirm your account.');
          } else {
            setMessage('Account created successfully! You are now signed in.');
            setTimeout(() => router.push(redirectTo), 1500);
          }
        } else {
          setError('Please check your email to confirm your account.');
        }
        setLoading(false);
        return;
      }

      router.push(redirectTo);

    } catch (error: any) {
      console.error('Auth error:', error);
      // Check if user was actually created despite the error
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user && isSignUp) {
        console.log('🎯 Signup worked despite error - user exists:', user.email);
        setMessage('Account created! Please check your email to confirm your account.');
        setLoading(false);
        return;
      }
      // Friendlier invalid email message
      if (error?.status === 400 && /invalid/i.test(error?.message || '')) {
        setError('That email address looks invalid. Use a real, accessible email (e.g., Gmail).');
      } else {
        setError(error.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const normalizedEmail = cleanEmail(email);
      const emailParsed = emailSchema.safeParse(normalizedEmail);
      if (!emailParsed.success) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const { error } = await supabaseClient.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the magic link!');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="block text-center text-orange-600 hover:text-orange-500 mb-4">
            ← Back to Home
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {redirectTo.includes('admin') 
              ? 'Admin Access' 
              : (isSignUp ? 'Create account' : 'Sign in')
            }
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pawfect Match {redirectTo.includes('admin') ? 'Admin Dashboard' : 'Authentication'}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Auth Method Toggle */}
          <div className="mb-6">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setUseMagicLink(false)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
                  !useMagicLink
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setUseMagicLink(true)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
                  useMagicLink
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Magic Link
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}

          {useMagicLink ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>

              <p className="text-xs text-gray-600 text-center">
                We'll send you a secure link to sign in without a password.
              </p>
            </form>
          ) : (
            <>
              {message && (
                <div className="mb-4 rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">{message}</div>
                </div>
              )}
              <form onSubmit={handlePasswordAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
              </button>

              {!redirectTo.includes('admin') && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </button>
                </div>
              )}
            </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}