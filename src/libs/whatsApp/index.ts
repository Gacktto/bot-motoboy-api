// lib/whatsapp/index.ts
import { Client, LocalAuth } from "whatsapp-web.js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const clients = new Map<string, Client>();
const clientReadyStatus = new Map<string, boolean>();

export function initializeWhatsAppClient(userId: string): Client {
  if (clients.has(userId)) return clients.get(userId)!;

  // Create base sessions directory if it doesn't exist
  const baseSessionDir = path.join(process.cwd(), "sessions");
  if (!fs.existsSync(baseSessionDir)) {
    fs.mkdirSync(baseSessionDir, { recursive: true });
  }

  // Create user-specific session directory
  const sessionDir = path.join(baseSessionDir, userId);
  const sessionFilePath = path.join(sessionDir, "session.json");

  // Create user directory if it doesn't exist
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const client = new Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth({ clientId: userId }),
    session: fs.existsSync(sessionFilePath)
      ? JSON.parse(fs.readFileSync(sessionFilePath, "utf8"))
      : undefined,
  });

  client.on("authenticated", (session) => {
    console.log(`Usuário ${userId} autenticado!`);
    try {
      fs.writeFileSync(sessionFilePath, JSON.stringify(session));
      console.log(`Sessão salva para usuário ${userId}`);
    } catch (error) {
      console.error(`Erro ao salvar sessão para usuário ${userId}:`, error);
    }
  });

  client.on("ready", () => {
    console.log(`Cliente WhatsApp do usuário ${userId} pronto!`);
    clientReadyStatus.set(userId, true);
  });

  client.on("auth_failure", (msg) => {
    console.log(`Falha na autenticação para ${userId}:`, msg);
    clientReadyStatus.set(userId, false);
    clients.delete(userId);
  });

  client.on("disconnected", (reason) => {
    console.log(`Cliente WhatsApp do usuário ${userId} desconectado:`, reason);
    clientReadyStatus.set(userId, false);
    clients.delete(userId);

    // Deleta a pasta da sessão
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
  });

  client.initialize();
  clients.set(userId, client);
  clientReadyStatus.set(userId, false);

  return client;
}

export function isWhatsAppConnected(userId: string): boolean {
  return clientReadyStatus.get(userId) ?? false;
}

export function getQRCode(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = initializeWhatsAppClient(userId);

    client.once("qr", async (qrCode) => {
      try {
        const qrCodeImage = await QRCode.toDataURL(qrCode);
        resolve(qrCodeImage);
      } catch (error) {
        reject(new Error("Erro ao gerar QR Code"));
      }
    });

    setTimeout(() => reject(new Error("Timeout na geração do QR Code")), 10000);
  });
}
