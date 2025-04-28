import z from "zod";

export const authRegisterBodySchema = z.object({
  name: z
    .string()
    .min(5, "Nome deve conter no mínimo 5 letras")
    .nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de telefone inválido"),
});

export const authLoginBodySchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Número de telefone inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});
