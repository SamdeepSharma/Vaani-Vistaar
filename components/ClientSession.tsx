
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const ClientSession: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <>
          <li><Link href="/signin" className="hover:underline">Sign In</Link></li>
          <li><Link href="/signup" className="hover:underline">Sign Up</Link></li>
        </>
      ) : (
        <li>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="hover:underline"
          >
            Sign Out
          </button>
        </li>
      )}
    </>
  );
};

export default ClientSession;
