import { FastifyInstance } from "fastify";
import { login, register } from "./auth-service";

export async function authController(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}
