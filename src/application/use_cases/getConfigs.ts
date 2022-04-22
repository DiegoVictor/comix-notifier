import * as configRepository from '@infra/repositories/config';
import * as Config from '@entities/Config';
import { IConfig } from '@application/contracts/IConfig';

type CatalogConfig = Record<string, number>;

const createConfig = async <T>(config: IConfig<T>) =>
  configRepository.createOne(config);

const getOrCreateConfig = async <T>(name: string, fallbackValue: T) =>
  configRepository.getOneByName<T>(name).then(
    (config) =>
      config ||
      createConfig<T>(
        Config.create<T>({
          name,
          value: fallbackValue,
        })
      )
  );

export const getConfigs = async () =>
  Promise.all([
    getOrCreateConfig<string[]>('urls', [process.env.FALLBACK_MANGA_URL]),
    getOrCreateConfig<CatalogConfig>('catalog', {}),
  ]);
