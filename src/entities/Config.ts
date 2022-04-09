import { IConfig } from "@application/contracts/IConfig";
import { randomUUID } from "crypto";

export const create = <T>({
  id = randomUUID(),
  name,
  value,
}: Record<string, any>): IConfig<T> => ({
  id,
  name,
  value,
});
