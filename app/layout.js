// app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import FCMInitializer from "../components/FCMInitializer";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
          <FCMInitializer />

        </Providers>
      </body>
    </html>
  );
}
