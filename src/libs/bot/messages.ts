export default function GroupMessages(message: any): string {
    switch (message.toLowerCase()) {
      case "ver status":
        return "Em breve irei responder meu status";
      default:
        return ""; // ou alguma resposta padrão como "Comando não reconhecido"
    }
  }
  