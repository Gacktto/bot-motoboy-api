import { FastifyInstance } from "fastify";
import { middlewareJWTAuthenticate } from "../../../middlewares/authenticate";
import {
  create,
  destroy,
  enterpriseById,
  list,
} from "./enterprise-contacts-services";

export async function enterpriseContactsController(app: FastifyInstance) {
  app.get(
    "/enterprise-contacts",
    { preHandler: middlewareJWTAuthenticate },
    list
  );

  app.get(
    "/enterprise-contacts/:id",
    { preHandler: middlewareJWTAuthenticate },
    enterpriseById
  );

  app.post(
    "/enterprise-contacts",
    { preHandler: middlewareJWTAuthenticate },
    create
  );

  app.delete(
    "/enterprise-contacts/:id",
    { preHandler: middlewareJWTAuthenticate },
    destroy
  );
}
