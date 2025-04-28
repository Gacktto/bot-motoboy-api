import { FastifyReply } from "fastify";
import z from "zod";

export function handleError(
  reply: FastifyReply,
  error: any,
  message: string = "Ocorreu um erro."
) {
  console.error(error);
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message,
      errors: error.errors,
    });
  }

  // Caso seja outro tipo de erro, retorna 500
  return reply.status(500).send({ message });
}
