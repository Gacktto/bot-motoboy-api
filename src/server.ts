import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { authController } from "./modules/public/auth/auth-controller";
import { whatsAppController } from "./modules/admin/whastapp/whastapp-controller";
import { enterpriseContactsController } from "./modules/admin/enterprise-contacts/enterprise-contacts-controller";
import { deliveriesContactsController } from "./modules/admin/deliveries/deliveries-controller";
import { botConectionController } from "./modules/admin/bot-conection/bot-conection-controller";
import { syncBotStatesOnStartup } from "./startup/syncBots";
import { clients } from "./libs/bot/manager";
import { prisma } from "./services/prismaService";
import { registerRoutes } from "./routes/routes";
import { register } from "module";

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";
const app = Fastify({ logger: true });

// app.register(cors, {
//   origin: process.env.APP_URL,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-User-ID"],
// });

app.register(cors, {
  origin: true, // permite todas as origens
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-ID"],
});

app.register(authController);
// app.register(whatsAppController);
app.register(enterpriseContactsController);
app.register(deliveriesContactsController);
app.register(botConectionController);
app.register(registerRoutes);

app.get("/debug/connected-users", async () => {
  const connectedUsers = Array.from(clients.keys());
  console.log("Usuários com bots conectados:", connectedUsers);
  return { connectedUsers };
});

app.get("/debug/all-users-status", async () => {
  const allUsers = await prisma.botConection.findMany();

  const result = allUsers.map((user) => {
    const isClientConnectedNow = clients.has(user.userId);

    return {
      userId: user.userId,
      dbIsConnected: user.isConnected,
      isRunning: user.isRunning,
      updatedAt: user.updatedAt,
      clientConnected: isClientConnectedNow,
    };
  });

  console.log("Status de todos os usuários:", result);

  return { users: result };
});

app.get("/", async () => {
  return { message: "Bem-vindo ao Moto Bot!" };
});

const start = async () => {
  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3333;
  try {
    await app.listen({ port, host: "0.0.0.0" });
    await syncBotStatesOnStartup();
    console.log(`Servidor rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};


start();
