import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../services/prismaService";
import { handleError } from "../../../utils/handleError";
import { authLoginBodySchema, authRegisterBodySchema } from "./auth-schemas";
import { comparePassword, hashPassword } from "../../../libs/bcryptjs";
import { generateToken } from "../../../libs/jwt";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, name, password, phone } = authRegisterBodySchema.parse(
      request.body
    );

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.send({ error: "Usuário já existe", status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user and BotConnection in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
        },
      });

      // Create BotConnection record for the new user
      await tx.botConection.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    return reply.send({
      message:
        "Usuário criado com sucesso! Agora, faça login para acessar sua conta.",
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    handleError(reply, error, "Ocorreu um erro ao criar o usuário.");
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { phone, password } = authLoginBodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return reply.send({ error: "Usuário não encontrado", status: 404 });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return reply.send({
        error: "Senha incorreta",
        status: 400,
      });
    }

    // Gere o token JWT
    const token = generateToken({ id: user.id, name: user.name });

    // Definir o token JWT como um cookie seguro
    reply.setCookie("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
      sameSite: "none", // ou "Lax", dependendo do comportamento que você quiser
      maxAge: 60 * 60 * 24 * 2, // 2 dias
    });

    // Definir o token JWT como um cookie seguro
    reply.setCookie("userId", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
      sameSite: "none", // ou "Lax", dependendo do comportamento que você quiser
      maxAge: 60 * 60 * 24 * 2, // 2 dias
    });

    // Opcionalmente, ainda pode retornar o userId no body
    return reply.send({ message: "Login realizado com sucesso", userId: user.id, authToken: token, status: 200 });

  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao fazer login.");
  }
}
