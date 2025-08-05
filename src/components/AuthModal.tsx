'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import GoogleSignIn from './GoogleSignIn';
import { clientSignIn, clientSignUp } from '@/src/utils/clientActions';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isSignUp) {
                await clientSignUp(email, password);
                setSuccess('Account created successfully! You can now sign in.');
                setEmail('');
                setPassword('');
                setIsSignUp(false);
            } else {
                await clientSignIn(email, password);
                onAuthSuccess();
            }
        } catch (err: any) {
            setError(err.message || `${isSignUp ? 'Signup' : 'Login'} failed`);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = () => {
        onAuthSuccess();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isSignUp ? 'Sign up to get started with AutoDig' : 'Sign in to your AutoDig account'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-green-500 text-sm text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                                className="border-border focus:border-autodigPrimary focus:ring-autodigPrimary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-border focus:border-autodigPrimary focus:ring-autodigPrimary/20"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-autodigPrimary text-autodigBlue font-semibold hover:bg-autodigPrimary/90 transition-colors"
                            disabled={loading}
                        >
                            {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <GoogleSignIn onSuccess={handleGoogleSuccess} />
                    </div>

                    <div className="mt-6 text-center text-sm">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setIsSignUp(false)}
                                    className="text-autodigPrimary hover:underline font-medium"
                                >
                                    Sign in
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setIsSignUp(true)}
                                    className="text-autodigPrimary hover:underline font-medium"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 