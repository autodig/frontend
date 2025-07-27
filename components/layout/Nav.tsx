'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

export default function Nav() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.location.href = '/dashboard';
  };

  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          {/* Left-aligned navigation items */}
          <div className="flex gap-6 items-center font-semibold">
            <Image
              src="/logo-no-background.png"
              alt="AutoDig"
              width={20}
              height={20}
            />
            <Link href={"/"} className="text-autodigPrimary text-lg font-bold">
              AUTODIG
            </Link>
          </div>

          {/* Right-aligned navigation items */}
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-autodigPrimary text-sm">
              About
            </Link>
            <Link href="/contact" className="hover:text-autodigPrimary text-sm">
              Contact
            </Link>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="bg-autodigPrimary text-autodigBlue hover:bg-autodigPrimary/90"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}