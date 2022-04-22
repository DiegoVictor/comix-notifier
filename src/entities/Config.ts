import { randomUUID } from 'crypto';

import { IConfig } from '@application/contracts/IConfig';

export const create = <T>({
  id = randomUUID(),
  name,
  value,
}: Record<string, any>): IConfig<T> => ({
  id,
  name,
  value,
});
