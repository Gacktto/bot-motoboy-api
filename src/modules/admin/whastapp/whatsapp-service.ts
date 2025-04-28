import { FastifyReply, FastifyRequest } from "fastify";
import { getQRCode, isWhatsAppConnected } from "../../../libs/whatsApp";

export async function qrCodeGenerate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Verifica se o WhatsApp já está autenticado
  if (isWhatsAppConnected()) {
    return reply.status(400).send({ message: "WhatsApp já está conectado!" });
  }

  try {
    const qrCodeImage = await getQRCode();
    return reply.send({ qrCodeImage });
  } catch (error) {
    return reply.status(500).send({ error: "Erro ao gerar QR Code." });
  }
}
