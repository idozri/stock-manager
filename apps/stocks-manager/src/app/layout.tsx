'use client';

import { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Providers from './providers';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {pathname === '/' ? (
            <>{children}</>
          ) : (
            <MainLayout>{children}</MainLayout>
          )}
        </Providers>
      </body>
    </html>
  );
}
