import { FastifyInstance } from "fastify";
import { middlewareJWTAuthenticate } from "../../../middlewares/authenticate";
import { botConectionStatus, qrCodeGenerate } from "./bot-conection-service";

export async function botConectionController(app: FastifyInstance) {
  app.get(
    "/bot-conection/status",
    { preHandler: middlewareJWTAuthenticate },
    botConectionStatus
  );

  app.get(
    "/bot-conection/qrcode",
    { preHandler: middlewareJWTAuthenticate },
    qrCodeGenerate
  );
}
