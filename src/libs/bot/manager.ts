import { Client } from "whatsapp-web.js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { createWhatsAppClient } from "./client";
import { prisma } from "../../services/prismaService";

export const clients = new Map<string, Client>();

function getSessionPath(userId: string) {
  return path.resolve(__dirname, "..", "..", "..", "sessions", userId);
}

export function getOrCreateClient(userId: string): Client {
  if (clients.has(userId)) return clients.get(userId)!;

  const client = createWhatsAppClient(userId);

  client.on("ready", async () => {
    console.log(`[${userId}] Client ready!`);
    clients.set(userId, client);

    /**
     * Updates or creates a bot connection record in the database when a client becomes ready
     * Sets connection status to connected and not running
     * @param {string} userId - The unique identifier for the bot user
     */
    await prisma.botConection.upsert({
      where: { userId },
      create: { userId, isConnected: true, isRunning: false },
      update: { isConnected: true, isRunning: false },
    });
  });

  client.on("disconnected", async () => {
    console.log(`[${userId}] Disconnected`);
    clients.delete(userId);

    // Remove pasta de sessão
    const sessionPath = getSessionPath(userId);
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    /**
     * Updates all bot connection records for a specific user to mark them as disconnected and not running
     * @param {string} userId - The unique identifier for the bot user
     */
    await prisma.botConection.updateMany({
      where: { userId },
      data: { isConnected: false, isRunning: false },
    });
  });

  return client;
}

export function isClientConnected(userId: string): boolean {
  const client = clients.get(userId);
  return !!client && !!client.info?.wid;
}

const qrListeners = new Map<string, (qr: string) => void>();

export function generateQRCode(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = getOrCreateClient(userId);

    // Remove listener anterior se existir
    if (qrListeners.has(userId)) {
      client.removeListener("qr", qrListeners.get(userId)!);
      qrListeners.delete(userId);
    }

    const qrCallback = async (qr: string) => {
      try {
        const qrImage = await QRCode.toDataURL(qr);
        resolve(qrImage);
        qrListeners.delete(userId); // remove após sucesso

        await prisma.botConection.upsert({
          where: { userId },
          create: { userId, isConnected: false, isRunning: false },
          update: { isConnected: false, isRunning: false },
        });
      } catch (err) {
        reject(err);
      }
    };

    qrListeners.set(userId, qrCallback);
    client.once("qr", qrCallback);
  });
}

export async function disconnectClient(userId: string): Promise<boolean> {
  try {
    const client = clients.get(userId);
    if (client) {
      await client.destroy();
      clients.delete(userId);
    }

    const sessionPath = getSessionPath(userId);
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    await prisma.botConection.updateMany({
      where: { userId },
      data: { isConnected: false, isRunning: false },
    });

    return true;
  } catch (error) {
    console.error(`Error disconnecting client for user ${userId}:`, error);
    return false;
  }
}
