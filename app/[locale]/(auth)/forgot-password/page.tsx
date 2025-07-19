'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSelector } from './../signup/page'; // Assuming this is in the same directory

const LogoSection = () => {
  const t = useTranslations('forgotPassword.brand');
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
        <img
          src="/logo.png"
          alt={t('logoAlt')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E0E]/10 to-transparent" />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-[#4A0E0E] text-3xl font-bold leading-tight tracking-tight">
          {t('name')}
        </h2>
        <span className="text-[#C45C26] text-sm font-medium leading-tight tracking-wider">
          {t('slogan')}
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
  const t = useTranslations('forgotPassword');

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
        setError(result.message || t('error.default'));
      }
    } catch (err) {
      setError(t('error.default'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF1E5] to-[#FFD6A5] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <LanguageSelector />
      <div className="max-w-md w-full space-y-6 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl border-2 border-[#C45C26]/20">
        <LogoSection />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#4A0E0E]">{t('header.title')}</h2>
          <p className="text-[#8B4513] text-sm">{t('header.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#8B4513]">
              {t('form.email.label')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26]/60 focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                placeholder={t('form.email.placeholder')}
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
                <Loader2 className="animate-spin mr-3 h-5 w-5" />
                {t('form.submit.loading')}
              </span>
            ) : t('form.submit.default')}
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

        <div className="text-center text-sm">
          <Link href="/signin" className="flex items-center justify-center font-medium text-[#C45C26] hover:text-[#FFA500]">
            <ArrowLeft className="mr-2" size={16} />
            {t('backToSignIn')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;