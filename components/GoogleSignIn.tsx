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
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground font-medium">
                        Or continue with
                    </span>
                </div>
            </div>
            <div id="google-signin-button" className="flex justify-center"></div>
        </div>
    );
} 