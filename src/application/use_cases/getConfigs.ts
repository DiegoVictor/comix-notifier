import * as configRepository from "@infra/repositories/config";

export const getConfigs = async () =>
  Promise.all([
    configRepository.getOneByName<string[]>("urls"),
    configRepository.getOneByName<Record<string, number>>("catalog"),
  ]);
