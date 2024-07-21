import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "E-commerce Sign-up and Login Flow",
  description:
    "A simple e-commerce application with user registration, login, category selection, and persistence features.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
