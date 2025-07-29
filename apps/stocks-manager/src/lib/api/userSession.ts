// User session management for simple localStorage-based user system
import { UserSessionDto } from '@stocks-manager/interfaces';

// Type alias for backward compatibility
type UserSession = UserSessionDto;

const SESSION_KEY = 'stocks-manager-session';
const SESSION_COOKIE_KEY = 'stocks-manager-session-id';

// Generate a unique session ID
const generateSessionId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get current user session
export const getUserSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null; // SSR check

  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error reading user session:', error);
    return null;
  }
};

// Create a new user session
export const createUserSession = (userName: string): UserSession => {
  const session: UserSession = {
    sessionId: generateSessionId(),
    userName: userName.trim(),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Also set cookie for server-side middleware checks
  setCookie(SESSION_COOKIE_KEY, session.sessionId);
  return session;
};

// Update user name in current session
export const updateUserName = (newName: string): UserSession | null => {
  const currentSession = getUserSession();
  if (!currentSession) return null;

  const updatedSession: UserSession = {
    ...currentSession,
    userName: newName.trim(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
};

// Clear user session (logout)
export const clearUserSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  // Also clear session cookie
  deleteCookie(SESSION_COOKIE_KEY);
};

// Check if user has a session
export const hasUserSession = (): boolean => {
  return getUserSession() !== null;
};

// Cookie utility functions for server-side middleware support
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof window === 'undefined') return; // SSR check

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') return; // SSR check

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};

// Get cookie value (for client-side usage)
export const getCookieValue = (name: string): string | null => {
  if (typeof window === 'undefined') return null; // SSR check

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Sync session cookie if localStorage has session but cookie doesn't exist
// This ensures backward compatibility for existing users
export const syncSessionCookie = (): void => {
  if (typeof window === 'undefined') return; // SSR check

  const session = getUserSession();
  const existingCookie = getCookieValue(SESSION_COOKIE_KEY);

  // If we have a localStorage session but no cookie, set the cookie
  if (session && !existingCookie) {
    setCookie(SESSION_COOKIE_KEY, session.sessionId);
  }

  // If we have a cookie but no localStorage session, clear the cookie
  if (!session && existingCookie) {
    deleteCookie(SESSION_COOKIE_KEY);
  }
};
