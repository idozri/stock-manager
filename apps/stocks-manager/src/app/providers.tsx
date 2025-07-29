'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { UserProvider } from '@/contexts/UserContext';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Material Design Blue
    },
    secondary: {
      main: '#388e3c', // Material Design Green
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
