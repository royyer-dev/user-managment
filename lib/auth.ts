// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, Role, User as PrismaDbUser } from "@prisma/client";
import bcrypt from "bcryptjs";

// Definimos el tipo específico para lo que 'authorize' debe devolver
type AuthorizeResponseUser = Omit<PrismaDbUser, "password">;

// Instanciamos PrismaClient aquí o podríamos importarlo si tuviéramos
// una instancia centralizada (para este ejemplo, lo dejamos aquí)
const prisma = new PrismaClient();

// Exportamos authOptions desde este archivo central
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthorizeResponseUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
        // user es inferido como PrismaDbUser | null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          console.log("No user found with that email");
          return null;
        }
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          console.log("Invalid password for user:", user.email);
          return null;
        }
        console.log("Credentials valid for user:", user.email);
        // Creamos userWithoutPassword (tipo AuthorizeResponseUser)
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // El parámetro 'user' aquí es inferido como AuthorizeResponseUser | undefined
    async jwt({ token, user }) {
      // El tipo AuthorizeResponseUser tiene 'role'
      if (user) {
        token.id = user.id;
        token.role = user.role; // user.role es de tipo Role (enum)
      }
      return token;
    },
    async session({ session, token }) {
      // session.user y token tienen 'role' gracias a types/next-auth.d.ts
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // token.role es de tipo Role (enum)
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Asegúrate de tener NEXTAUTH_SECRET en tu .env y en Vercel
  debug: process.env.NODE_ENV === "development",
};
