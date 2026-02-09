import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const font = Inter({
  subsets: ["latin"],
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "MediCore HMS",
  description: "Professional Hospital Management System",
  icons: {
    icon: '/favicon.ico', // Ensure a favicon exists or remove this line
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${font.className} antialiased bg-slate-50 text-slate-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
