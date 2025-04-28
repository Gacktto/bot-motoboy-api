import { FastifyRequest, FastifyReply } from "fastify";
import { listAllUsers, searchUser } from "../../services/user.service";

interface UserParams {
    id: string
}

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
    try {
        const users = await listAllUsers();
        reply.send(users);
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(req:FastifyRequest<{Params: UserParams}>, reply: FastifyReply) {
    try {
        const user = await searchUser(req.params.id)

        if (!user) {
            return reply.status(404).send({ message: "Usuário não encontrado" })
        }

        reply.send(user);
    } catch (error) {
        console.log(error);
    }    
}