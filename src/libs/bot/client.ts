import { Client, LocalAuth } from "whatsapp-web.js";
import fs from "fs";
import path from "path";

export function createWhatsAppClient(userId: string): Client {
  const sessionDir = path.resolve(__dirname, "..", "..", "..", ".wwebjs_auth");

  const client = new Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth({
      clientId: userId,
      dataPath: sessionDir,
    }),
  });

  client.on("authenticated", (session) => {
    console.log(`[${userId}] Sessão autenticada`);
  });

  client.on("ready", () => {
    console.log(`[${userId}] Cliente pronto!`);
  });

  client.on("auth_failure", () => {
    console.log(`[${userId}] Falha na autenticação`);
  });

  client.on("message", (message) => {
    console.log(message);
  })

  client.on("disconnected", () => {
    const userSessionDir = path.join(sessionDir, userId);
    if (fs.existsSync(userSessionDir)) {
      fs.rmSync(userSessionDir, { recursive: true, force: true });
    }
    console.log(`[${userId}] Cliente desconectado`);
  });

  client.initialize();

  return client;
}
