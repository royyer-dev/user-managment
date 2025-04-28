// app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth"; // Usando ruta relativa
import { redirect } from "next/navigation";
import { Role, PrismaClient } from "@prisma/client"; // Importa PrismaClient también
import UserList from "./components/UserList"; // Importaremos el componente de lista

// --- NUEVO: Definir el tipo para los datos de usuario ---
type UserFromDb = {
  id: string;
  name: string; // Asegúrate que coincida si es opcional o no en tu schema/select
  email: string;
  role: Role;
  createdAt: Date;
};
// -------------------------------------------------------

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== Role.ADMIN) {
    console.log(
      `Intento de acceso no autorizado a /admin. Usuario: ${session?.user?.email}, Rol: ${session?.user?.role}`
    );
    redirect("/");
  }

  // --- MODIFICADO: Añadir tipo explícito a 'users' ---
  let users: UserFromDb[] = []; // Tipo explícito UserFromDb[]
  // -------------------------------------------------
  try {
    // users será ahora inferido correctamente aquí también
    users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        {/* Encabezado (igual que antes) */}
        {/* ... */}

        {/* Saludo al Admin (igual que antes) */}
        {/* ... */}

        {/* Mensaje informativo (igual que antes) */}
        {/* <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-600 rounded-r-lg">...</div> */}

        {/* Sección de Contenido Admin */}
        <div className="mt-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Lista de Usuarios Registrados
          </h2>
          {/* El componente UserList espera 'UserForList[]'.
              Nuestro tipo 'UserFromDb[]' debe ser compatible.
              Si UserForList se definió igual en UserList.tsx, funcionará.
              Podríamos importar UserForList si quisiéramos ser más estrictos.
          */}
          {users.length > 0 ? (
            <UserList users={users} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No se encontraron usuarios.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
