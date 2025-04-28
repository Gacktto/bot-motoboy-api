import { prisma } from "../services/prismaService";

export async function syncBotStatesOnStartup() {
  try {
    // Buscar todos os bots no banco de dados com isConnected igual a true
    const bots = await prisma.botConection.findMany({
      where: { isConnected: true },  // Considera apenas os bots que estavam conectados
    });

    for (const bot of bots) {
      // Desativa todos os bots que estavam marcados como conectados
      console.log(`Atualizando bot ${bot.userId} para desconectado no banco`);
      
      await prisma.botConection.update({
        where: { userId: bot.userId },
        data: {
          isConnected: false,  // Marca como desconectado no banco
          isRunning: false,    // Marca como não executando
          updatedAt: new Date(),  // Atualiza a data de atualização
        },
      });
    }
  } catch (error) {
    console.error("Erro ao sincronizar estados dos bots na inicialização:", error);
  }
}
