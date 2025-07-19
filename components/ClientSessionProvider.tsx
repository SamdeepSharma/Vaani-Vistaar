"use client"; 
import { SessionProvider } from 'next-auth/react';

interface ClientSessionProviderProps {
  children: React.ReactNode;
}

const ClientSessionProvider: React.FC<ClientSessionProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientSessionProvider;
