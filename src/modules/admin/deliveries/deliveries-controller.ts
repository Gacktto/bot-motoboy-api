import { FastifyInstance } from "fastify";
import { middlewareJWTAuthenticate } from "../../../middlewares/authenticate";
import {
  acceptDelivery,
  create,
  list,
  rejectDelivery,
} from "./deliveries-services";

export async function deliveriesContactsController(app: FastifyInstance) {
  app.get("/deliveries", { preHandler: middlewareJWTAuthenticate }, list);
  app.post("/deliveries", { preHandler: middlewareJWTAuthenticate }, create);
  app.post(
    "/deliveries/:id/accept",
    { preHandler: middlewareJWTAuthenticate },
    acceptDelivery
  );
  app.post(
    "/deliveries/:id/reject",
    { preHandler: middlewareJWTAuthenticate },
    rejectDelivery
  );
}
