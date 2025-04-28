// app/api/register/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    const { name, email, password } = body;

    // 2. Validación básica de entrada
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nombre, email y contraseña son requeridos" },
        { status: 400 } // Bad Request
      );
    }
    // (Opcional: Añadir validaciones más robustas, como formato de email, longitud de contraseña)

    // 3. Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 409 } // Conflict
      );
    }

    // 4. Hashear la contraseña
    const saltRounds = 10; // Número de rondas de salting (costo computacional)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Crear el nuevo usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Guardar la contraseña hasheada
        role: "USER", // Asignar rol por defecto (asegúrate que coincida con tu enum Role)
      },
    });

    // 6. Opcional: Omitir la contraseña del objeto retornado
    const { password: _, ...userWithoutPassword } = newUser;

    // 7. Retornar respuesta exitosa
    return NextResponse.json(
      { user: userWithoutPassword, message: "Usuario creado exitosamente" },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error en el registro:", error);

    // Manejar errores específicos de Prisma si es necesario
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Ejemplo: manejar violación de restricción única (aunque ya lo chequeamos)
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "El email ya está en uso (error prisma)" },
          { status: 409 }
        );
      }
    }

    // Error genérico del servidor
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor durante el registro" },
      { status: 500 } // Internal Server Error
    );
  } finally {
    // Asegurarse de desconectar Prisma (importante en entornos serverless)
    // await prisma.$disconnect(); // Descomentar si experimentas problemas de conexión
  }
}
