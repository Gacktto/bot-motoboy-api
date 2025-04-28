import { FastifyInstance } from "fastify";
import { middlewareJWTAuthenticate } from "../../../middlewares/authenticate";
import { qrCodeGenerate } from "./whatsapp-service";

export async function whatsAppController(app: FastifyInstance) {
  app.get(
    "/bot-conection/qrcode",
    { preHandler: middlewareJWTAuthenticate },
    qrCodeGenerate
  );
}
