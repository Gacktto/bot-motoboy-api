import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: string | JwtPayload;
  }
}

export async function middlewareJWTAuthenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Sem autenticação" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.status(401).send({ message: "Token inválido" });
    }

    const userId = request.headers["x-user-id"]; // Changed from "user-id" to "x-user-id"
    if (!userId) {
      return reply.status(401).send({ message: "Usuário não encontrado" });
    }

    // Verifica e decodifica o token
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return reply.status(500).send({ message: "Chave secreta não definida" });
    }
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // Verifica se o token está expirado
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return reply.status(401).send({ message: "Token expirado" });
    }

    request.user = decoded; // Armazena os dados do usuário na requisição
    done(); // Finaliza o middleware e continua a execução da rota
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido ou expirado" });
  }
}
