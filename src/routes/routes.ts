import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";

export async function registerRoutes(app: FastifyInstance) {
    await userRoutes(app);    
}