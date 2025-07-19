'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { User, Lock, Loader2 } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/');
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
          <h1 className="mt-6 text-3xl font-bold text-[#4A0E0E]">
           Welcome Back
          </h1>
          <p>Sign in to your account</p>
          
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
                      <Input
                        {...field}
                        placeholder="Email or Username"
                        className="pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26] focus:ring-[#FFA500] focus:border-[#FFA500]"
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C45C26]" size={18} />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className="pl-10 pr-3 py-2 border-2 border-[#E6B587] rounded-full text-[#4A0E0E] placeholder-[#C45C26] focus:ring-[#FFA500] focus:border-[#FFA500]"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-medium text-[#C45C26] hover:text-[#FFA500]">
                Forgot Password?
              </Link>
            </div>
            <button
            type="submit"
           
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#C45C26] to-[#FFA500] hover:from-[#A0522D] hover:to-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-[#FFA500] group-hover:text-[#FFD700]" aria-hidden="true" />
              </span>
              Sign In
            </button>
          </form>
        </Form>
        <div className="text-sm text-center">
          <p className="text-[#8B4513]">
            Not a member yet?{' '}
            <Link href="/signup" className="font-medium text-[#C45C26] hover:text-[#FFA500]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}