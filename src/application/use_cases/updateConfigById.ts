import * as configRepository from "@infra/repositories/config";

export const updateConfigById = async <T>(id: string, value: T) =>
  configRepository.updateOneById<T>(id, value);
