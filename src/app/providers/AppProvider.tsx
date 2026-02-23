import type { ReactNode } from 'react';
import { KeycloakProvider } from './KeycloakProvider';
import { QueryProvider } from './QueryProvider';
import { Toaster } from 'sonner';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <KeycloakProvider>
      <QueryProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </QueryProvider>
    </KeycloakProvider>
  );
}
