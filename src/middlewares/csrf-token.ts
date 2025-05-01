import { FastifyReply, FastifyRequest } from "fastify";
import Tokens from 'csrf';

const tokens = new Tokens(); // Uma única instância reutilizável

export function verifyCsrf(request: FastifyRequest, reply: FastifyReply): boolean {
  const secret = request.cookies.csrf_secret;
  const token = request.headers['csrf-token'];

  // Se não houver um segredo no cookie ou um token na requisição, retorna falso
  if (!secret || !token) {
    reply.status(403).send({ error: 'CSRF token missing or invalid' });
    return false;
  }

  // Verifica o CSRF token
  if (!tokens.verify(secret, token as string)) {
    reply.status(403).send({ error: 'Invalid CSRF token' });
    return false;
  }

  return true;
}
