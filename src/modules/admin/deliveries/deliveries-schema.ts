import z from "zod";

export const deliveryCreateSchema = z.object({
  userId: z.string(),
  enterpriseContactsId: z.string(),
});

export const deliveryAcceptSchema = z.object({
  id: z.string(),
});
