import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Star Wars Collectors",
  description: "Your ultimate Star Wars memorabilia collection management system",
  icons: {
    icon: "/vader.png",
    shortcut: "/vader.png",
    apple: "/vader.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <Sonner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
