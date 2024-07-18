'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "VOTAKI - Seu sistema de votação",
// };

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <ToastContainer autoClose={6000} />
        </SessionProvider>
      </body>
    </html>
  );
}
