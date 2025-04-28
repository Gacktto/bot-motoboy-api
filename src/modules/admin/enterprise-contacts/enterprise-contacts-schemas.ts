import z from "zod";

export const enterpriseBodySchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  phone: z.string().nonempty("Telefone é obrigatório"),
});

export const enterpriseParamsSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
