'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { LanguageSelector } from '../signup/page'

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('verifyOTP');

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      router.push('/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        router.push('/reset-password');
      } else {
        setError(result.message || t('error.invalidOTP'));
      }
    } catch (err) {
      setError(t('error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const LogoSection = () => {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
          <img 
            src="/logo.png" 
            alt={t('brand.logoAlt')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E0E]/10 to-transparent" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-[#4A0E0E] text-3xl font-bold leading-tight tracking-tight">
            {t('brand.name')}
          </h2>
          <span className="text-[#C45C26] text-sm font-medium leading-tight tracking-wider">
            {t('brand.slogan')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF1E5] to-[#FFD6A5] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <LanguageSelector />
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl border-2 border-[#C45C26]/20">
        <div className="text-center">
          <LogoSection />
          <h2 className="mt-6 text-2xl font-bold text-[#4A0E0E]">{t('header.title')}</h2>
          <p className="mt-2 text-sm text-[#8B4513]">
            {t('header.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
              <input
                type="text"
                id="otp"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26]/60 focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder={t('form.otpPlaceholder')}
                required
                aria-label={t('form.otpLabel')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#C45C26] to-[#FFA500] hover:from-[#A0522D] hover:to-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-[#FFD700]" aria-hidden="true" />
                ) : (
                  <Lock className="h-5 w-5 text-[#FFD700] group-hover:text-[#FFFF00]" aria-hidden="true" />
                )}
              </span>
              {isLoading ? t('form.verifying') : t('form.verify')}
            </button>
          </div>
        </form>

        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="text-center text-sm">
          <Link href="/forgot-password" className="font-medium text-[#C45C26] hover:text-[#FFA500] flex items-center justify-center">
            <ArrowLeft size={16} className="mr-2" />
            {t('backLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;