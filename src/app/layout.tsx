'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
          {children}
          <ToastContainer autoClose={6000} />
        </SessionProvider>
      </body>
    </html>
  );
}
