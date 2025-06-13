// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/app/layout.tsx
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AutoDig",
  description: "The smartest way to manage call time",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-32 items-center">
              <Nav />
              {/* Removed px-5 from here to allow sections to span full width */}
              <div className="flex flex-col w-full">
                {children}
              </div>
              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}