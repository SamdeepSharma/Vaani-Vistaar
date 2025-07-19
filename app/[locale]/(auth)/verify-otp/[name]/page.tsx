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
import { useTranslations } from 'next-intl';
import { LanguageSelector } from '../../signup/page'; // Assuming this component is exported from SignUpForm

const verifySchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const LogoSection = () => {
  const t = useTranslations('verify.brand');
  
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

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ name: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('verify');

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
      const response = await axios.post<ApiResponse>('/api/verify', {
        tempUserId,
        otp: data.otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast({
        title: t('toast.success.title'),
        description: response.data.message,
      });
      localStorage.removeItem('tempUserId');
      router.replace('/signin');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: t('toast.error.title'),
        description: axiosError.response?.data.message ?? t('toast.error.defaultDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF1E5] to-[#FFD6A5] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <LanguageSelector />
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl border-2 border-[#C45C26]/20">
        <div className="text-center">
          <LogoSection />
          <h1 className="mt-6 text-3xl font-extrabold text-[#4A0E0E]">
            {t('header.title')}
          </h1>
          <p className="mt-2 text-sm text-[#8B4513]">{t('header.subtitle')}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8B4513]">{t('form.otp.label')}</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
                    <Input
                      {...field}
                      className="w-full pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26]/60 focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                      placeholder={t('form.otp.placeholder')}
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
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-3 h-5 w-5" />
                  {t('form.submit.loading')}
                </span>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-[#FFD700] group-hover:text-[#FFFF00]" aria-hidden="true" />
                  </span>
                  {t('form.submit.default')}
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}