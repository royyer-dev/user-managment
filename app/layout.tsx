// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider"; // Importa el proveedor

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Management App",
  description: "App with NextAuth and Roles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Envuelve children con AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
