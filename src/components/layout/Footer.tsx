// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react"; // Example social icons

export default function Footer() {
  return (
    <footer className="w-full bg-card dark:bg-card text-foreground border-t border-border py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        {/* Column 1: Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/logo-no-background.png"
              alt="AutoDig Logo"
              width={25}
              height={25}
            />
            <span className="text-autodigPrimary text-xl font-bold">AUTODIG</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            The smartest way to manage call time and maximize your impact.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-autodigPrimary transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-autodigPrimary transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-autodigPrimary transition-colors">
              <Linkedin size={20} />
            </Link>
            <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-autodigPrimary transition-colors">
              <Github size={20} />
            </Link>
          </div>
        </div>

        {/* Column 2: Products */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4">Products</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/dashboard" className="hover:text-autodigPrimary transition-colors">Dashboard</Link></li>
            <li><Link href="/features" className="hover:text-autodigPrimary transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-autodigPrimary transition-colors">Pricing</Link></li>
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">Integrations</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-autodigPrimary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-autodigPrimary transition-colors">Contact</Link></li>
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Column 4: Legal & Resources */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-autodigPrimary transition-colors">FAQs</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} AutoDig. All rights reserved.
      </div>
    </footer>
  );
}