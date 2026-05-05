import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SECURE-OHM | P2P EV Charging Network",
  description: "Secure, decentralized, and grid-aware P2P electric vehicle charging network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#00f2ff",
              colorBackground: "#1a1a1a",
              colorText: "#ffffff",
              colorTextSecondary: "#a1a1aa",
              colorInputBackground: "#0a0a0a",
              colorInputText: "#ffffff",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "glass-card border-white/5",
              navbar: "hidden", 
              headerTitle: "text-primary font-bold",
              socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 transition-all",
              formButtonPrimary: "neon-button bg-primary hover:shadow-[0_0_20px_var(--primary-glow)]",
              userButtonPopoverCard: "glass-card border-white/10 bg-[#1a1a1a]",
              userButtonPopoverActionButtonText: "text-white hover:text-primary transition-colors",
              userButtonPopoverActionIcon: "text-primary",
              userPreviewMainIdentifier: "text-white font-bold",
              userPreviewSecondaryIdentifier: "text-white/50",
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
