// app/admin/components/UserList.tsx
"use client"; // Marcamos como Client Component

import React from "react";
import { Role } from "@prisma/client"; // Importar Role para tipado

// Definir el tipo para cada usuario en la lista (basado en el select de Prisma)
type UserForList = {
  id: string;
  name: string; // Asumiendo que 'name' es requerido en tu schema
  email: string;
  role: Role;
  createdAt: Date;
};

// Definir las props del componente
interface UserListProps {
  users: UserForList[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  // Función para formatear fechas
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      // Formato para México
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="py-3 px-6">
              Nombre
            </th>
            <th scope="col" className="py-3 px-6">
              Email
            </th>
            <th scope="col" className="py-3 px-6">
              Rol
            </th>
            <th scope="col" className="py-3 px-6">
              Registrado
            </th>
            {/* <th scope="col" className="py-3 px-6">ID</th> */}
            {/* <th scope="col" className="py-3 px-6">Acciones</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {user.name}
              </th>
              <td className="py-4 px-6">{user.email}</td>
              <td className="py-4 px-6">
                {/* Mostrar el rol con un estilo distintivo */}
                <span
                  className={`px-2 py-0.5 rounded font-medium text-xs ${
                    user.role === Role.ADMIN
                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-4 px-6">{formatDate(user.createdAt)}</td>
              {/* <td className="py-4 px-6 text-xs font-mono">{user.id}</td> */}
              {/* <td className="py-4 px-6">
                  Aquí podrían ir botones de Editar/Eliminar en el futuro
               </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
