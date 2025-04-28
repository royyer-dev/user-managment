// app/components/AuthButtons.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";
// Opcional: Descomenta si quieres usar el botón de shadcn/ui
// import { Button } from '@/components/ui/button';

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4 h-9">
        {" "}
        {/* Altura fija para evitar saltos */}
        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  // Si hay sesión activa
  if (session) {
    return (
      // Contenedor flex con alineación vertical y espaciado
      <div className="flex items-center space-x-4">
        {/* Saludo */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Hola, {session.user?.name || session.user?.email}!
        </span>
        {/* Botón Sign Out con más estilo */}
        <button
          onClick={() => signOut()}
          className="px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
        >
          Cerrar Sesión
        </button>
        {/* Alternativa con shadcn/ui:
        <Button variant="destructive" size="sm" onClick={() => signOut()}>
          Cerrar Sesión
        </Button> */}
      </div>
    );
  }

  // Si NO hay sesión activa
  return (
    <div className="flex items-center space-x-3">
      {/* Botón Sign In */}
      <button
        onClick={() => signIn()}
        className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
      >
        Iniciar Sesión
      </button>
      {/* <Button size="sm" onClick={() => signIn()}>Iniciar Sesión</Button> */}

      {/* Enlace de Registro */}
      <Link href="/register">
        <span className="px-4 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900">
          Registrarse
        </span>
        {/* <Button variant="outline" size="sm" asChild>
           <Link href="/register">Registrarse</Link>
        </Button> */}
      </Link>
    </div>
  );
}
