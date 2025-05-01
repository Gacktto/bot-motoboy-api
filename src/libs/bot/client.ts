import { Client, LocalAuth } from "whatsapp-web.js";
import fs from "fs";
import path from "path";
import GroupMessages from "./messages";

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
    const send = (msg: string) => {
      client.sendMessage(message.from, msg)
    }
    switch (message.body) {
      case "comandos":
        send("*Lista de comandos ativos:* \n\n1. Ativar bot \n2. Pausar bot \n3. Ver status \n4. Ver lista de contatos \n5. Adicionar contato \n6. Remover contato \n7. Localizar endereço \n8. Obter clima \n9. Registrar gastos \n10. Registrar corridas finalizadas \n\nDigite o número correspondente ao comando que deseja executar");
        break;
      case "1":
        send("*Ativando bot...*");
        break;
      case "2":
        send("*Desativando bot...*");
        break;
      case "3":
        send("📊 *Status do Bot* \n\n🟢 Estado Atual: PAUSED \n⏰ Última Ativação: 07-01 / 09:25AM ou PM \n⏸️ Último Pause: 07-01 / 09:15AM ou PM");
        break;
      case "4":
        send("🗞️ *Lista de contatos:* \n\n👤 *Motoboy:* Elder, 📱 *Telefone:* (11) 96038-5583 \n👤 *Motoboy:* Pedro, 📱 *Telefone:* (11) 94002-8922");
        break;
      case "5":
        send("*Digite as informações abaixo para adicionar um contato:* \n\nNúmero de telefone: \nNome da empresa/pessoa:");
        break;
      case "6":
        send("*Digite as informações abaixo para remover um contato:* \n\nNúmero de telefone:");
        break;
      case "7":
        send("📍 *Qual endereço que deseja localizar?*");
        break;
      case "8":
        send("🌤️ *Clima de São Paulo*");
        break;
      case "9":
        send("*Digite as informações abaixo para registrar os gastos:* \n\nValor gasto: \nIdentificação do gasto:");
        break;
      case "10":
        send("*Digite as informações abaixo para registrar corridas finalizadas:* \n\nValor da corrida: \nDestino:");
        break;
    }
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
