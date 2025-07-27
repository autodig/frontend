'use client';

import { createSession, clearSession } from './sessionManager';

export const clientSignIn = async (email: string, password: string) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        createSession(result.token, result.user);

        window.location.href = '/dashboard';
        return result;
    } catch (error) {
        throw error;
    }
};

export const clientSignUp = async (email: string, password: string) => {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        return result;
    } catch (error) {
        throw error;
    }
};

export const clientSignOut = () => {
    clearSession();
    window.location.href = '/';
}; 