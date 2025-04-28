import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../../../utils/handleError";
import { prisma } from "../../../services/prismaService";
import {
  deliveryAcceptSchema,
  deliveryCreateSchema,
} from "./deliveries-schema";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.headers["user-id"] as string;
  try {
    const deliveries = await prisma.delivery.findMany({
      where: {
        userId,
      },
    });

    return reply.status(200).send(deliveries);
  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao listar os contatos.");
  }
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId, enterpriseContactsId } = deliveryCreateSchema.parse(
      request.body
    );

    const hasDeliveryPending = await prisma.delivery.findFirst({
      where: {
        userId,
        enterpriseContactsId,
        status: "PENDING",
      },
    });

    if (hasDeliveryPending) {
      return reply.status(400).send({
        message: "Já existe uma entrega pendente para este contato.",
      });
    }

    const delivery = await prisma.delivery.create({
      data: {
        userId,
        enterpriseContactsId,
        status: "PENDING",
      },
    });

    return reply.status(201).send(delivery);
  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao criar uma entrega.");
  }
}

export async function acceptDelivery(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = deliveryAcceptSchema.parse(request.params);

    const hasDeliveryPending = await prisma.delivery.findFirst({
      where: {
        id,
        status: "PENDING",
      },
    });

    if (!hasDeliveryPending) {
      return reply.status(400).send({
        message: "Não existe uma entrega pendente para este contato.",
      });
    }
    const delivery = await prisma.delivery.update({
      where: {
        id,
      },
      data: {
        status: "PROGRESS",
      },
    });
    return reply.status(200).send(delivery);
  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao aceitar a entrega.");
  }
}

export async function rejectDelivery(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = deliveryAcceptSchema.parse(request.params);

    const hasDeliveryPending = await prisma.delivery.findFirst({
      where: {
        id,
        status: "PENDING",
      },
    });

    if (!hasDeliveryPending) {
      return reply.status(400).send({
        message: "Não existe uma entrega pendente para este contato.",
      });
    }

    const delivery = await prisma.delivery.update({
      where: {
        id,
      },
      data: {
        status: "CANCELED",
      },
    });

    return reply.status(200).send(delivery);
  } catch (error) {
    handleError(reply, error, "Ocorreu um erro ao rejeitar a entrega.");
  }
}
