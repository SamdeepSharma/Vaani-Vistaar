'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signIn } from 'next-auth/react';
import { Loader2, User, Lock, Eye, EyeOff } from 'lucide-react';

import { signInSchema } from '@/schemas/signInSchema';
import { useTranslations } from 'next-intl';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe, Check } from 'lucide-react';

const LogoSection = () => {
  const t = useTranslations('signIn.brand');
  
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

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('signIn');

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: t('toast.error.title'),
          description: t('toast.error.incorrectCredentials'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('toast.error.title'),
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/');
    }
    setIsSubmitting(false);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-[#8B4513]">{t('form.identifier.label')}</label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
                      <Input
                        {...field}
                        placeholder={t('form.identifier.placeholder')}
                        className="w-full pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26]/60 focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-[#8B4513]">{t('form.password.label')}</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={t('form.password.placeholder')}
                        className="w-full pl-10 pr-10 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26]/60 focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition-all duration-200 ease-in-out"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-medium text-[#C45C26] hover:text-[#FFA500]">
                {t('form.forgotPassword')}
              </Link>
            </div>

            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#C45C26] to-[#FFA500] hover:from-[#A0522D] hover:to-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
            </button>

            <div className="text-center text-sm">
              <span className="text-[#8B4513]">{t('signUp.text')}</span>{' '}
              <Link href="/signup" className="font-medium text-[#C45C26] hover:text-[#FFA500]">
                {t('signUp.link')}
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' }
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (langCode: string) => {
    router.push(pathname.replace(`/${currentLocale}`, `/${langCode}`));
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 border-2 border-[#C45C26]/20"
        >
          <Globe className="text-[#C45C26]" size={20} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border-2 border-[#C45C26]/20 py-2 w-48">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-[#FDF1E5] transition-colors duration-150
                  ${currentLocale === language.code ? 'text-[#C45C26] font-medium' : 'text-[#4A0E0E]'}`}
              >
                <span className="flex items-center space-x-2">
                  <span>{language.name}</span>
                </span>
                {currentLocale === language.code && <Check size={16} className="text-[#C45C26]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};