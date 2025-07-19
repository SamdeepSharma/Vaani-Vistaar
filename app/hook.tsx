import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth for authentication

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin'); // Redirect to sign-in page if not authenticated
    }
  }, [status]);

  return { session, status };
};

export default useAuth;
