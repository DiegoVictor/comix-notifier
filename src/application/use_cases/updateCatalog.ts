import { IVolume } from '@application/contracts/IVolume';

export const updateCatalog = (
  catalog: Record<string, number>,
  volumes: IVolume[]
) =>
  volumes.reduce((updatedCatalog, volume) => {
    updatedCatalog[volume.slug] = volume.number;
    return updatedCatalog;
  }, catalog);
