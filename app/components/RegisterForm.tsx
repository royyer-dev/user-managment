// app/components/RegisterForm.tsx
"use client"; // Necesario para useState, useRouter y manejo de eventos

import React, { useState } from "react";
// Importamos useRouter desde next/navigation para App Router
import { useRouter } from "next/navigation";
// Opcional: importar componentes de shadcn/ui si se prefiere
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

export default function RegisterForm() {
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para mensajes de error
  const [error, setError] = useState<string | null>(null);
  // Estado para indicar carga
  const [isLoading, setIsLoading] = useState(false);

  // Hook para manejar la navegación
  const router = useRouter();

  // Manejador para el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir recarga de página
    setError(null); // Limpiar errores previos

    // Validación simple en cliente
    if (!name || !email || !password) {
      setError("Todos los campos son requeridos.");
      return;
    }
    // (Aquí podrías añadir validaciones más específicas si quisieras)

    setIsLoading(true); // Indicar inicio de carga

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json(); // Intentar leer respuesta siempre

      if (!response.ok) {
        // Si la respuesta no es OK (ej: 400, 409, 500), usar el mensaje de la API si existe
        setError(
          data.message || `Error ${response.status}: ${response.statusText}`
        );
      } else {
        // Registro exitoso (status 201)
        console.log("Registro exitoso:", data);
        // Redirigir a la página de inicio de sesión que provee NextAuth
        router.push("/api/auth/signin");
        // O podrías redirigir a una página de éxito o directamente al login
        // alert('¡Registro exitoso! Por favor, inicia sesión.'); // O mostrar mensaje
      }
    } catch (fetchError: any) {
      // Error en la comunicación (red, etc.)
      console.error("Error en fetch:", fetchError);
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setIsLoading(false); // Indicar fin de carga
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border rounded-lg shadow-md max-w-sm mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Registro</h2>

      {/* Campo Nombre */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nombre:
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Campo Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Campo Contraseña */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Contraseña:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Mensaje de Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
          {error}
        </p>
      )}

      {/* Botón de Envío */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Registrando..." : "Registrar"}
      </button>
    </form>
  );
}
