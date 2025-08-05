'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { getSession, validateToken, isAuthenticated } from '@/src/utils/sessionManager';

interface LandingPageProps {
    children: React.ReactNode;
}

export default function LandingPage({ children }: LandingPageProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = getSession();

            if (session) {
                // Check if session is expired or invalid
                const isValid = await validateToken();
                if (!isValid) {
                    // Session expired, show auth modal
                    setShowAuthModal(true);
                } else {
                    // Valid session, redirect to dashboard
                    router.push('/dashboard');
                    return;
                }
            }

            setIsChecking(false);
        };

        checkSession();
    }, [router]);

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        router.push('/dashboard');
    };

    const handleCloseModal = () => {
        setShowAuthModal(false);
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-autodigPrimary"></div>
            </div>
        );
    }

    return (
        <>
            {children}
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