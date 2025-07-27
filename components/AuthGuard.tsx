'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { getSession, validateToken, isAuthenticated } from '@/utils/sessionManager';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = getSession();

            if (session) {
                // Validate token with backend
                const isValid = await validateToken();
                if (isValid) {
                    setIsAuthenticated(true);
                    setIsValidating(false);
                    return;
                }
            }

            // No valid session found
            setIsAuthenticated(false);
            setIsValidating(false);
            setShowAuthModal(true);
        };

        checkSession();
    }, []);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
    };

    const handleCloseModal = () => {
        setShowAuthModal(false);
        router.push('/');
    };

    if (isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-autodigPrimary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <div className="flex items-center justify-center min-h-screen bg-background">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to AutoDig</h1>
                        <p className="text-muted-foreground mb-8">Please sign in to access your dashboard</p>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-autodigPrimary text-autodigBlue font-semibold px-8 py-3 rounded-lg hover:bg-autodigPrimary/90 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
                {showAuthModal && (
                    <AuthModal
                        isOpen={showAuthModal}
                        onClose={handleCloseModal}
                        onAuthSuccess={handleAuthSuccess}
                    />
                )}
            </>
        );
    }

    return <>{children}</>;
} 