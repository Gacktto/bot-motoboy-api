import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../services/prismaService";
import { handleError } from "../../../utils/handleError";
import { authLoginBodySchema, authRegisterBodySchema } from "./auth-schemas";
import { comparePassword, hashPassword } from "../../../libs/bcryptjs";
import { generateToken } from "../../../libs/jwt";

import { verifyCsrf } from "../../../middlewares/csrf-token";

import validator from "validator";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {

    if (!verifyCsrf(request, reply)) {
      return reply.status(403).send({ error: "CSRF token inválido" });
    }

    const { email, name, password, phone } = authRegisterBodySchema.parse(
      request.body
    );

    const normalizedEmail = validator.normalizeEmail(email);

    if (!normalizedEmail) {
      return reply.status(400).send({ error: "E-mail inválido." });
    }

    const cleanEmail = normalizedEmail;
    const cleanName = validator.escape(validator.trim(name));
    const cleanPhone = validator.whitelist(validator.trim(phone), "0-9+");
    const cleanPassword = validator.escape(password);

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return reply.send({ error: "Usuário já existe", status: 409 });
    }

    const hashedPassword = await hashPassword(cleanPassword);

    // Create user and BotConnection in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          name: cleanName,
          phone: cleanPhone,
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
    
    if (!verifyCsrf(request, reply)) {
      return reply.status(403).send({ error: "CSRF token inválido" });
    }

    const { phone, password } = authLoginBodySchema.parse(request.body);

    const cleanPhone = validator.blacklist(phone.trim(), "<>'\"/;"); // remove caracteres perigosos
    const cleanPassword = password.trim();

    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (!user) {
      return reply.send({ error: "Usuário não encontrado", status: 404 });
    }

    const isPasswordValid = await comparePassword(cleanPassword, user.password);

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
    return reply.send({ message: "Login realizado com sucesso", userId: user.id, token: token, status: 200 });

  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao fazer login.");
  }
}
