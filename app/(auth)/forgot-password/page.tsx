'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const LogoSection = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
        <img
          src="/logo.png"
          alt="VaaniVistaar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E0E]/10 to-transparent" />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-[#4A0E0E] text-3xl font-bold leading-tight tracking-tight">
          VaaniVistaar
        </h2>
        <span className="text-[#C45C26] text-sm font-medium leading-tight tracking-wider">
          TRANSLATE • CONNECT
        </span>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      
      if (response.ok) {
        setMessage(result.message);
        if (result.message.includes('OTP has been sent')) {
          localStorage.setItem('resetEmail', email);
          router.push('/verify-pass');
        }
      } else {
        setError(result.message || 'Something went wrong. Please try again later.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF1E5] to-[#FFD6A5] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl border-2 border-[#C45C26]/20">
       
        
        <LogoSection />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#4A0E0E]">Forgot Password?</h2>
          <p className="text-[#8B4513] text-sm">
            No worries! Enter your email and we'll send you a reset OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#8B4513]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26]/60 focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#C45C26] to-[#FFA500] hover:from-[#A0522D] hover:to-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </span>
            ) : 'Send Reset OTP'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;