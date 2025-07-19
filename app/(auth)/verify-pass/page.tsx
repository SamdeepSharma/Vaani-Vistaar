'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        setError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
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
            alt="VaaniVista" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E0E]/10 to-transparent" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-[#4A0E0E] text-3xl font-bold leading-tight tracking-tight">
            VaaniVista
          </h2>
          <span className="text-[#C45C26] text-sm font-medium leading-tight tracking-wider">
            TRANSLATE • CONNECT
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF1E5] to-[#FFD6A5] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border-2 border-[#C45C26]">
        <div className="text-center">
         <LogoSection />
          <h2 className="mt-6 text-3xl font-bold text-[#4A0E0E]">Verify OTP</h2>
          <p className="mt-2 text-sm text-[#8B4513]">
            Enter the OTP sent to your email
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
              <input
                type="text"
                id="otp"
                className="appearance-none rounded-full relative block w-full px-3 py-2 border-2 border-[#E6B587] placeholder-[#C45C26] text-[#4A0E0E] focus:outline-none focus:ring-[#FFA500] focus:border-[#FFA500] focus:z-10 sm:text-sm pl-10"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter OTP"
                required
                aria-label="Enter OTP"
              />
            </div>
          </div>

          <div>
            <button
             type="submit"
             className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#C45C26] to-[#FFA500] hover:from-[#A0522D] hover:to-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
           
              disabled={isLoading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-[#FFA500] animate-spin" aria-hidden="true" />
                ) : (
                  <Lock className="h-5 w-5 text-[#FFA500] group-hover:text-[#FFD700]" aria-hidden="true" />
                )}
              </span>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>

        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOTP;