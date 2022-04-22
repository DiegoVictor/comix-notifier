import { z } from 'zod';

const schema = z
  .object({
    token: z.string().min(1),
  })
  .required();

type Params = z.infer<typeof schema>;

export const token = (data: Params): Params => schema.parse(data);
