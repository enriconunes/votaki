'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "VOTAKI - Seu sistema de votação",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <SessionProvider>
          <LocationProvider>
            {children}
            <ToastContainer autoClose={6000} />
          </LocationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
