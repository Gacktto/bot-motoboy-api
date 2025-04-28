import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../services/prismaService";
import { handleError } from "../../../utils/handleError";
import {
  enterpriseBodySchema,
  enterpriseParamsSchema,
} from "./enterprise-contacts-schemas";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.headers["user-id"] as string;

  try {
    const enterprises = await prisma.enterpriseContacts.findMany({
      where: {
        userId,
      },
    });

    reply.status(200).send(enterprises);
  } catch (error) {
    handleError(reply, error);
  }
}

export async function enterpriseById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.headers["user-id"] as string;

  try {
    const { id } = enterpriseParamsSchema.parse(request.params);

    const enterprise = await prisma.enterpriseContacts.findUnique({
      where: {
        userId,
        id,
      },
    });

    if (!enterprise) {
      return reply.status(404).send({
        message: "Contato não encontrado.",
      });
    }

    reply.status(200).send(enterprise);
  } catch (error) {
    handleError(reply, error);
  }
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.headers["user-id"] as string;

  try {
    const { name, phone } = enterpriseBodySchema.parse(request.body);

    const hasUser = await prisma.enterpriseContacts.findFirst({
      where: {
        userId,
        name,
        phone,
      },
    });

    if (hasUser) {
      return reply.status(400).send({
        message: "Já existe um contato com esse nome e telefone.",
      });
    }

    const enterprise = await prisma.enterpriseContacts.create({
      data: {
        userId,
        name,
        phone,
      },
    });
    reply.status(201).send(enterprise);
  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao criar o contato.");
  }
}

export async function destroy(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.headers["user-id"] as string;

  try {
    const { id } = enterpriseParamsSchema.parse(request.params);
    const enterprise = await prisma.enterpriseContacts.findUnique({
      where: {
        userId,
        id,
      },
    });

    if (!enterprise) {
      return reply.status(404).send({
        message: "Contato não encontrado.",
      });
    }

    await prisma.enterpriseContacts.delete({
      where: {
        id,
      },
    });

    reply.status(200).send({ message: "Contato deletado com sucesso." });
  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao deletar o contato.");
  }
}
