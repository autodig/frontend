'use client';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    is_google_user?: boolean;
}

export interface Session {
    token: string;
    user: User;
    expiresAt: number;
}

export const SESSION_KEY = 'autodig_session';
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const createSession = (token: string, user: User): void => {
    const session: Session = {
        token,
        user,
        expiresAt: Date.now() + SESSION_DURATION,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const getSession = (): Session | null => {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) return null;

        const session: Session = JSON.parse(sessionData);

        // Check if session is expired
        if (Date.now() > session.expiresAt) {
            clearSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Error parsing session:', error);
        clearSession();
        return null;
    }
};

export const clearSession = (): void => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('temp_user'); // Clean up any temporary user data
};

export const cleanupCorruptedData = (): void => {
    try {
        // Check and clean corrupted session data
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData === 'undefined' || sessionData === 'null') {
            localStorage.removeItem(SESSION_KEY);
        }

        // Check and clean corrupted user data
        const userData = localStorage.getItem('user');
        if (userData === 'undefined' || userData === 'null') {
            localStorage.removeItem('user');
        }

        // Check and clean corrupted token data
        const tokenData = localStorage.getItem('token');
        if (tokenData === 'undefined' || tokenData === 'null') {
            localStorage.removeItem('token');
        }
    } catch (error) {
        console.error('Error cleaning up corrupted data:', error);
    }
};

export const isAuthenticated = (): boolean => {
    return getSession() !== null;
};

export const getCurrentUser = (): User | null => {
    // Clean up any corrupted data first
    cleanupCorruptedData();

    const session = getSession();
    if (session?.user) {
        return session.user;
    }

    // Try to get user from localStorage if session is not available
    try {
        const userString = localStorage.getItem('user');
        if (userString && userString !== 'undefined' && userString !== 'null') {
            return JSON.parse(userString);
        }
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        // Clear corrupted user data
        localStorage.removeItem('user');
    }

    return null;
};

export const refreshSession = (): void => {
    const session = getSession();
    if (session) {
        // Extend session by updating expiresAt
        session.expiresAt = Date.now() + SESSION_DURATION;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
};

export const validateToken = async (): Promise<boolean> => {
    const session = getSession();
    if (!session) return false;

    try {
        const response = await fetch('/api/auth/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        });

        if (response.ok) {
            refreshSession();
            return true;
        } else {
            clearSession();
            return false;
        }
    } catch (error) {
        console.error('Token validation error:', error);
        clearSession();
        return false;
    }
}; 