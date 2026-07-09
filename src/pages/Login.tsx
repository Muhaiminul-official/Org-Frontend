import React, { useState } from 'react';
import { Droplet, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { subscribeToPush } from '../utils/push';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/auth/google`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credentialResponse.credential }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Welcome back!');

        if (Notification.permission === 'granted') {
          await subscribeToPush(data.token);
        }
        onLogin();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Google login failed');
      }
    } catch (err) {
      toast.error('An error occurred during Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start Loader

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Successfully signed in');

        if (Notification.permission === 'granted') {
          await subscribeToPush(data.token);
        }
        onLogin();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Invalid email or password');
      }
    } catch (err) {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false); // Stop Loader
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B91C3C]/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#B91C3C]/5 blur-[120px] rounded-full" />

      <div className="max-w-md w-full relative z-10 transition-all duration-500">
        <div className="bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-xl p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-[#B91C3C]/20 blur-2xl rounded-full opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-tr from-red-600 to-red-400 rounded-xl flex items-center justify-center shadow-lg transform">
                <Droplet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white ">
              BLOOD<span className="text-[#B91C3C]">LINK</span>
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Save lives, one drop at a time.
            </p>
          </div>

          {/* Social Auth */}
          <div
            className={`mb-8 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              theme="filled_black"
              shape="pill"
              width="100%"
              onError={() => toast.error('Google login failed')}
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
              <span className="px-4 bg-transparent text-gray-400 dark:text-gray-500 font-bold">
                Secure Login
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#B91C3C] transition-colors" />
                </div>
                <input
                  name="email"
                  required
                  disabled={isLoading}
                  type="email"
                  className="w-full bg-gray-100/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/20 focus:border-[#B91C3C] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 disabled:opacity-50"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#B91C3C] transition-colors" />
                </div>
                <input
                  name="password"
                  required
                  disabled={isLoading}
                  type="password"
                  className="w-full bg-gray-100/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/20 focus:border-[#B91C3C] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 disabled:opacity-50"
                  placeholder="Password"
                />
              </div>
              {/* <div className="flex justify-end pr-2">
                <a
                  href="#"
                  className="text-xs font-semibold text-[#B91C3C] hover:text-red-400 transition-colors"
                >
                  Forgot Password?
                </a>
              </div> */}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-[#B91C3C] disabled:bg-red-800 text-white px-4 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-[#B91C3C]/20 flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-[#B91C3C]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-sm font-medium">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-gray-900 dark:text-white font-bold hover:text-[#B91C3C] transition-colors"
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
