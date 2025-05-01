import { FastifyRequest, FastifyReply } from "fastify";
import { getHeaders } from "../../../utils/getHeaders";
import { generateQRCode, isClientConnected } from "../../../libs/bot/manager";
import { prisma } from "../../../services/prismaService";
import { handleError } from "../../../utils/handleError";

export async function qrCodeGenerate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = getHeaders(request);

  if (isClientConnected(userId)) {
    return reply.status(400).send({ message: "Já conectado" });
  }

  try {
    const qrCode = await generateQRCode(userId);
    return reply.send({ qrCode }); // <-- esse return é crucial
  } catch (error) {
    if (!reply.sent) {
      handleError(reply, error, "Erro ao gerar QR Code.");
    } else {
      console.warn("Erro após resposta já enviada:", error);
    }
  }
}


export async function botConectionStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = getHeaders(request);

  try {
    const botConection = await prisma.botConection.findUnique({
      where: { userId },
    });

    if (!botConection) {
      return reply.status(404).send({ message: "Conexão não encontrada." });
    }

    return reply.send({
      isConnected: botConection.isConnected,
      isRunning: botConection.isRunning,
      lastUpdate: botConection.updatedAt,
    });
  } catch (error) {
    handleError(reply, error, "Erro ao buscar status da conexão.");
  }
}
