import { IVolume } from '@application/contracts/IVolume';

export const getOnlyNewVolumes = (
  volumes: IVolume[],
  catalog: Record<string, number>
) =>
  volumes.filter(
    (volume) => !catalog[volume.slug] || volume.number > catalog[volume.slug]
  );
