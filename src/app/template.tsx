'use client';

import { AuthProvider } from '../context/AuthContext';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
