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
import { qrCodeRoute } from "./routes/qrcode";
import helmet from '@fastify/helmet';

import Tokens from 'csrf';

import cookie from "@fastify/cookie"

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";
const app = Fastify({ logger: true });

const tokens = new Tokens();

// app.register(cors, {
//   origin: process.env.APP_URL,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-User-ID"],
// });

app.register(cors, {
  origin: true, // permite todas as origens
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-ID", "csrf-token"],
});

app.register(cookie, {
  secret: process.env.COOKIE_SECRET, // para cookies assinados (opcional)
});

app.register(helmet, {
  global: true,
  contentSecurityPolicy: false, // Desativado por padrão, habilite se for necessário
});


app.register(authController);
// app.register(whatsAppController);
app.register(enterpriseContactsController);
app.register(deliveriesContactsController);
app.register(botConectionController);
app.register(registerRoutes);

app.get('/csrf-token', async (req, reply) => {
  const secret = await tokens.secret();
  const token = tokens.create(secret);

  // Armazena o segredo em cookie seguro
  reply.setCookie('csrf_secret', secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'none', // <--- necessário para cross-origin
    secure: true,     // <--- obrigatório com SameSite 'none'
  });  

  return { csrfToken: token };
});

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