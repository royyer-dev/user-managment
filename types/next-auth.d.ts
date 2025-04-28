// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
// Importa tu enum Role desde el cliente Prisma generado
import { Role } from "@prisma/client";

// Extiende el tipo JWT para incluir id y role
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role; // Usamos el tipo Role importado
  }
}

// Extiende el tipo User (opcional pero bueno para consistencia)
declare module "next-auth" {
  interface User extends DefaultUser {
    // Añade el rol al tipo User base de NextAuth
    role: Role; // Usamos el tipo Role importado
    // Puedes añadir otros campos de tu modelo Prisma User aquí si los necesitas
    // directamente en el objeto User que a veces usan las callbacks.
  }

  // Extiende el tipo Session para incluir id y role en session.user
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role; // Usamos el tipo Role importado
    } & DefaultSession["user"]; // Mantenemos los campos originales (name, email, image)
  }
}
