// app/page.tsx
"use client"; // Necesitamos que sea Client Component para usar useSession

import AuthButtons from "./components/AuthButtons"; // Importamos los botones
import { useSession } from "next-auth/react"; // Importamos el hook useSession
import Link from "next/link"; // Para enlaces
import { Role } from "@prisma/client"; // Importar Role para la verificación

export default function Home() {
  // Obtenemos la sesión y el estado de carga del lado del cliente
  const { data: session, status } = useSession();

  // Función auxiliar para renderizar el contenido principal
  const renderMainContent = () => {
    // Mientras se carga la sesión
    if (status === "loading") {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Cargando sesión...
        </p>
      );
    }

    // Si el usuario ha iniciado sesión
    if (session) {
      return (
        <div className="text-center lg:text-left space-y-4">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            ¡Bienvenido de nuevo, {session.user?.name || session.user?.email}!
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Has iniciado sesión correctamente.
          </p>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-sm space-y-1">
            <p>
              <strong>Email:</strong> {session.user?.email}
            </p>
            <p>
              <strong>ID Usuario:</strong> {session.user?.id}
            </p>
            <p>
              <strong>Rol:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded font-medium text-xs ${
                  session.user?.role === Role.ADMIN
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {session.user?.role}
              </span>
            </p>
          </div>
          {/* Mostrar enlace al panel de admin SOLO si el usuario es ADMIN */}
          {session.user?.role === Role.ADMIN && (
            <Link href="/admin">
              <span className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 cursor-pointer">
                Ir al Panel de Admin
              </span>
            </Link>
          )}
        </div>
      );
    }

    // Si el usuario NO ha iniciado sesión
    return (
      <div className="text-center lg:text-left space-y-4">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Bienvenido al Gestor de Usuarios
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Por favor, inicia sesión o regístrate para continuar.
        </p>
        {/* Podrías añadir más contenido de landing page aquí */}
      </div>
    );
  };

  return (
    // Layout principal con min-h-screen y fondo
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Navbar simple */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo o Título de la App */}
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            Mi App
          </div>
          {/* Botones de Autenticación */}
          <div>
            <AuthButtons />
          </div>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        {/* Renderizamos el contenido principal basado en la sesión */}
        {renderMainContent()}
      </main>

      {/* Footer Simple */}
      <footer className="bg-white dark:bg-gray-800 py-4 mt-auto border-t dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Mi Aplicación. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
}
