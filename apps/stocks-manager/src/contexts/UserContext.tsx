'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {
  getUserSession,
  createUserSession,
  clearUserSession,
  updateUserName,
  syncSessionCookie,
} from '@/lib/api/userSession';
import { useAppDispatch } from '@/store/hooks';
import { loadUserStocks, clearPortfolio } from '@/store/portfolioSlice';
import { UserSessionDto, UserContextType } from '@stocks-manager/interfaces';

// Type aliases for backward compatibility
type UserSession = UserSessionDto;

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Load user session on mount
  useEffect(() => {
    // Sync session cookie for backward compatibility
    syncSessionCookie();

    const session = getUserSession();
    setUser(session);
    setIsLoading(false);

    // Load portfolio if user session exists
    if (session?.sessionId) {
      dispatch(loadUserStocks(session.sessionId));
    }
  }, [dispatch]);

  const createSession = (userName: string) => {
    const newSession = createUserSession(userName);
    setUser(newSession);

    // Load portfolio for new session
    if (newSession?.sessionId) {
      dispatch(loadUserStocks(newSession.sessionId));
    }
  };

  const updateUser = (newName: string) => {
    const updatedSession = updateUserName(newName);
    if (updatedSession) {
      setUser(updatedSession);
    }
  };

  const logout = () => {
    clearUserSession();
    setUser(null);

    // Clear portfolio on logout
    dispatch(clearPortfolio());
  };

  const value: UserContextType = {
    user,
    isLoading,
    hasSession: user !== null,
    createSession,
    updateUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
