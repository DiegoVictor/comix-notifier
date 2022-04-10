import * as configRepository from "@infra/repositories/config";
import { IConfig } from "@application/contracts/IConfig";

const createConfig = async <T>(config: IConfig<T>) =>
  configRepository.createOne(config);
export const getConfigs = async () =>
  Promise.all([
    configRepository.getOneByName<string[]>("urls"),
    configRepository.getOneByName<Record<string, number>>("catalog"),
  ]);
