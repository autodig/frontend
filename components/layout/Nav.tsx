import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Nav() {
  return (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-base">
                Products
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem className="text-sm">
                <Link href="/dashboard" className="block w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <Link href="/features" className="block w-full">
                  Features
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <Link href="/pricing" className="block w-full">
                  Pricing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right-aligned navigation items */}
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-autodigPrimary text-sm">
            About
          </Link>
          <Link href="/contact" className="hover:text-autodigPrimary text-sm">
            Contact
          </Link>
          <Button variant="default" size="sm">
            <Link href="/sign-in" className="text-primary-foreground">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}