// routes/qrcode.ts
import { FastifyInstance } from "fastify";
import { Client } from "whatsapp-web.js";
import QRCode from "qrcode";

export async function qrCodeRoute(fastify: FastifyInstance) {
  fastify.get("/bot-conection/qrcode", async (request, reply) => {
    try {
      const client = new Client({
        puppeteer: {
          headless: true,
          args: ['--no-sandbox'],
        },
      });

      return new Promise((resolve, reject) => {
        client.on("qr", async (qr) => {
          const qrImage = await QRCode.toDataURL(qr); // Gera imagem base64
          client.destroy(); // Fecha sessão após gerar o QR
          resolve(reply.send({ qrCode: qrImage }));
        });

        client.on("authenticated", () => {
          console.log("Autenticado");
        });

        client.on("auth_failure", (msg) => {
          console.error("Falha de autenticação:", msg);
          client.destroy();
          reject(reply.status(401).send({ error: "Falha de autenticação" }));
        });

        client.initialize();
      });
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
      return reply.status(500).send({ error: "Erro interno ao gerar QR Code" });
    }
  });
}
