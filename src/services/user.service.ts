import { prisma } from "./prismaService";


export async function listAllUsers() {
    return await prisma.user.findMany();
}

export async function searchUser(id: string) {
    return await prisma.user.findUnique({
        where: { id }
    });
}