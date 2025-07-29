'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useUser } from '@/contexts/UserContext';
import WelcomeDialog from '@/components/auth/WelcomeDialog';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, hasSession, createSession } = useUser();

  useEffect(() => {
    // If user has a session, redirect to portfolio
    if (!isLoading && hasSession && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, hasSession, router]);

  const handleWelcomeSubmit = (userName: string) => {
    createSession(userName);
    // After creating session, redirect to dashboard
    router.push('/dashboard');
  };

  // Show loading while checking user session
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={40} />
        <div style={{ fontSize: '16px', color: '#666' }}>
          Loading Stock Manager...
        </div>
      </Box>
    );
  }

  // If user has session, show loading while redirecting
  if (hasSession && user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        style={{ fontSize: '18px', color: '#666' }}
      >
        Redirecting to your portfolio...
      </Box>
    );
  }

  // Show welcome dialog for new users
  return <WelcomeDialog open={true} onSubmit={handleWelcomeSubmit} />;
}
