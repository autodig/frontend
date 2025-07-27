declare global {
    interface Window {
        google: any;
    }
}

export const initializeGoogleAuth = (onSuccess?: () => void) => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return new Promise<void>((resolve) => {
        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: (response: any) => handleCredentialResponse(response, onSuccess),
            });
            resolve();
        };
    });
};

import { createSession } from './sessionManager';

export const handleCredentialResponse = async (response: any, onSuccess?: () => void) => {
    try {
        const result = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.credential }),
        });

        const data = await result.json();

        if (data.success) {
            createSession(data.token, data.user);
            if (onSuccess) {
                onSuccess();
            } else {
                window.location.href = '/dashboard';
            }
        } else {
            console.error('Google auth failed:', data.message);
        }
    } catch (error) {
        console.error('Google auth error:', error);
    }
};

export const renderGoogleButton = (elementId: string) => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'center'
        }
    );
}; 