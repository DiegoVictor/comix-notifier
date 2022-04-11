import { IVolume } from "@application/contracts/IVolume";

export const updateCatalog = (
  catalog: Record<string, number>,
  volumes: IVolume[]
) => {
  volumes.forEach((volume) => {
    catalog[volume.slug] = volume.number;
  });
  return catalog;
};
