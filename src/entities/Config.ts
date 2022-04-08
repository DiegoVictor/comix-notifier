import { IConfig } from "@application/contracts/IConfig";

export const create = <T>({
  id,
  name,
  value,
}: Record<string, any>): IConfig<T> => ({
  id,
  name,
  value,
});
