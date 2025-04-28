// app/components/AuthProvider.tsx
"use client"; // Este componente debe ser de cliente

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Usamos React.FC para definir el componente funcional con props tipadas
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Envolvemos los children con SessionProvider de next-auth
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
