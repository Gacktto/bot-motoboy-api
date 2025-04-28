import { FastifyInstance } from "fastify";
import { getUsers, getUserById } from "../controllers/account/user.controller";

export async function userRoutes(app:FastifyInstance) {
    app.get('/users/:id', getUserById);
}