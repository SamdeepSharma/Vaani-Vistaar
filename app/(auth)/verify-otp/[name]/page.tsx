'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';

const verifySchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ name: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true);

    try {
      const tempUserId = localStorage.getItem('tempUserId');
      if (!tempUserId) {
        throw new Error('No temporary user ID found');
      }
      console.log('Submitting verification:', { tempUserId, otp: data.otp });
      const response = await axios.post<ApiResponse>('/api/verify', {
        tempUserId,
        otp: data.otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Verification response:', response.data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      localStorage.removeItem('tempUserId');
      router.replace('/signin');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error('Verification error:', (error as AxiosError).response?.data || (error as AxiosError).message);
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
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
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl border border-[#C45C26]">
        <div className="text-center">
          <LogoSection />
          <h1 className="mt-6 text-3xl font-extrabold text-[#4A0E0E]">
            Verify Your Account
          </h1>
          <p className="mt-2 text-sm text-[#8B4513]">Enter the verification code sent to your email or phone</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4A0E0E]">Verification Code</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
                    <Input
                      {...field}
                      className="pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26] focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#C45C26] to-[#FFA500] hover:from-[#A0522D] hover:to-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-[#FFD700] animate-spin" aria-hidden="true" />
                ) : (
                  <Lock className="h-5 w-5 text-[#FFD700] group-hover:text-[#FFFF00]" aria-hidden="true" />
                )}
              </span>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}