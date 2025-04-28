import { FastifyRequest } from "fastify";

export const getHeaders = (request: FastifyRequest) => {
  const userId = request.headers["x-user-id"];

  return {
    userId: userId as string,
  };
};
