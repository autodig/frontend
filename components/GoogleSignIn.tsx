'use client';

import { useEffect } from 'react';
import { initializeGoogleAuth, renderGoogleButton } from '@/utils/googleAuth';

interface GoogleSignInProps {
    onSuccess?: () => void;
}

export default function GoogleSignIn({ onSuccess }: GoogleSignInProps) {
    useEffect(() => {
        initializeGoogleAuth(onSuccess)?.then(() => {
            renderGoogleButton('google-signin-button');
        });
    }, [onSuccess]);

    return (
        <div className="w-full">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <div id="google-signin-button" className="mt-4"></div>
        </div>
    );
} 